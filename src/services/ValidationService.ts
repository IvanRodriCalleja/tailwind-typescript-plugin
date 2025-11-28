import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameValidator } from '../core/interfaces';
import { ClassNameInfo, UtilityFunction } from '../core/types';
import { ICssProvider, TailwindConflictDetector } from '../infrastructure/TailwindConflictDetector';
import { Logger } from '../utils/Logger';
import { ClassNameExtractionService } from './ClassNameExtractionService';
import { DiagnosticService } from './DiagnosticService';

/**
 * Service responsible for validating class names and creating diagnostics
 * Orchestrates the validation workflow
 */
export class ValidationService {
	private readonly conflictDetector: TailwindConflictDetector;

	constructor(
		private readonly extractionService: ClassNameExtractionService,
		private readonly diagnosticService: DiagnosticService,
		private readonly validator: IClassNameValidator,
		private readonly logger: Logger,
		cssProvider?: ICssProvider
	) {
		this.conflictDetector = new TailwindConflictDetector();
		if (cssProvider) {
			this.conflictDetector.setCssProvider(cssProvider);
		}
	}

	/**
	 * Validate a source file and return diagnostics
	 * PERFORMANCE OPTIMIZED: Minimal logging overhead
	 */
	validateFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilityFunctions: UtilityFunction[],
		typeChecker?: ts.TypeChecker
	): ts.Diagnostic[] {
		if (!this.validator.isInitialized()) {
			this.logger.log(
				`[ValidationService] Validator not initialized yet for ${sourceFile.fileName}`
			);
			return [];
		}

		// PERFORMANCE: Only log if enabled
		if (this.logger.isEnabled()) {
			this.logger.log(`[ValidationService] Processing file: ${sourceFile.fileName}`);
		}

		// Extract all class names from the file
		const classNames = this.extractionService.extractFromSourceFile(
			typescript,
			sourceFile,
			utilityFunctions,
			typeChecker
		);

		// PERFORMANCE: Only log if enabled
		if (this.logger.isEnabled()) {
			this.logger.log(`[ValidationService] Found ${classNames.length} class names to validate`);
		}

		// Filter invalid class names
		const invalidClasses = this.filterInvalidClasses(classNames);

		// Detect duplicate classes (only for valid classes, to avoid double-reporting)
		const { trueDuplicates, extractableClasses } = this.findDuplicateClasses(classNames);

		// Detect conflicting classes (only for valid, non-duplicate classes)
		const conflicts = this.conflictDetector.findConflicts(classNames);

		// PERFORMANCE: Only log if enabled
		if (this.logger.isEnabled()) {
			const totalIssues =
				invalidClasses.length +
				trueDuplicates.length +
				extractableClasses.length +
				conflicts.length;
			if (totalIssues > 0) {
				this.logger.log(
					`[ValidationService] Returning ${invalidClasses.length} invalid + ${trueDuplicates.length} duplicate + ${extractableClasses.length} extractable + ${conflicts.length} conflict diagnostics`
				);
			} else {
				this.logger.log(`[ValidationService] No issues found`);
			}
		}

		const diagnostics: ts.Diagnostic[] = [];

		if (invalidClasses.length > 0) {
			diagnostics.push(...this.diagnosticService.createDiagnostics(invalidClasses, sourceFile));
		}

		if (trueDuplicates.length > 0) {
			diagnostics.push(
				...this.diagnosticService.createDuplicateDiagnostics(trueDuplicates, sourceFile)
			);
		}

		if (extractableClasses.length > 0) {
			diagnostics.push(
				...this.diagnosticService.createExtractableClassDiagnostics(extractableClasses, sourceFile)
			);
		}

		if (conflicts.length > 0) {
			diagnostics.push(...this.diagnosticService.createConflictDiagnostics(conflicts, sourceFile));
		}

		return diagnostics;
	}

	/**
	 * Filter out valid classes and return only invalid ones
	 * PERFORMANCE OPTIMIZED: No logging in hot path
	 */
	private filterInvalidClasses(classNames: ClassNameInfo[]): ClassNameInfo[] {
		// PERFORMANCE: Skip logging each class validation (hot path)
		// This method is called for every class in every file
		return classNames.filter(classInfo => !this.validator.isValidClass(classInfo.className));
	}

	/**
	 * Result of duplicate detection with separate categories
	 */
	private findDuplicateClasses(classNames: ClassNameInfo[]): {
		trueDuplicates: ClassNameInfo[];
		extractableClasses: ClassNameInfo[];
	} {
		const trueDuplicates: ClassNameInfo[] = [];
		const extractableClasses: ClassNameInfo[] = [];

		// Group classes by attributeId
		const byAttribute = new Map<string, ClassNameInfo[]>();

		for (const classInfo of classNames) {
			// Use attributeId if available, otherwise use a unique key per class
			// (which means no duplicates can be detected for classes without attributeId)
			const key = classInfo.attributeId || `${classInfo.absoluteStart}`;

			if (!byAttribute.has(key)) {
				byAttribute.set(key, []);
			}
			byAttribute.get(key)!.push(classInfo);
		}

		// For each attribute, find duplicates
		for (const classes of byAttribute.values()) {
			// Group by class name first
			const byClassName = new Map<string, ClassNameInfo[]>();
			for (const classInfo of classes) {
				const className = classInfo.className;
				if (!byClassName.has(className)) {
					byClassName.set(className, []);
				}
				byClassName.get(className)!.push(classInfo);
			}

			// Analyze each class that appears multiple times
			for (const [, occurrences] of byClassName) {
				if (occurrences.length <= 1) {
					continue;
				}

				// Separate root-level classes from branch classes
				const rootClasses = occurrences.filter(c => !c.conditionalBranchId);
				const branchClasses = occurrences.filter(c => c.conditionalBranchId);

				// Case 1: Class at root level AND in branches = true duplicate
				// Mark ALL occurrences as duplicates (both root and branch)
				if (rootClasses.length > 0 && branchClasses.length > 0) {
					trueDuplicates.push(...rootClasses, ...branchClasses);
				}

				// Case 2: Multiple occurrences at root level = true duplicate
				if (rootClasses.length > 1) {
					// Mark ALL occurrences as duplicates
					trueDuplicates.push(...rootClasses);
				}

				// Case 3: Same class in different branches of same ternary
				// Check if class appears in BOTH branches of any ternary
				if (branchClasses.length > 0 && rootClasses.length === 0) {
					// Group by ternary ID
					const byTernary = new Map<string, { true: ClassNameInfo[]; false: ClassNameInfo[] }>();

					for (const classInfo of branchClasses) {
						const branchId = classInfo.conditionalBranchId!;
						// Parse: "ternary:true:123" or "ternary:false:123"
						const match = branchId.match(/^ternary:(true|false):(\d+)$/);
						if (match) {
							const [, branch, ternaryId] = match;
							if (!byTernary.has(ternaryId)) {
								byTernary.set(ternaryId, { true: [], false: [] });
							}
							byTernary.get(ternaryId)![branch as 'true' | 'false'].push(classInfo);
						}
					}

					// Check each ternary
					for (const [, branches] of byTernary) {
						if (branches.true.length > 0 && branches.false.length > 0) {
							// Class appears in BOTH branches - this is extractable (hint)
							// Mark ALL occurrences in both branches as extractable suggestions
							// so the user sees the hint on both sides of the ternary
							extractableClasses.push(...branches.true, ...branches.false);
						} else {
							// Class only in one branch - check for duplicates within that branch
							if (branches.true.length > 1) {
								trueDuplicates.push(...branches.true);
							}
							if (branches.false.length > 1) {
								trueDuplicates.push(...branches.false);
							}
						}
					}
				}
			}
		}

		return { trueDuplicates, extractableClasses };
	}
}
