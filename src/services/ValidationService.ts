import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameValidator } from '../core/interfaces';
import { ClassNameInfo } from '../core/types';
import { Logger } from '../utils/Logger';
import { ClassNameExtractionService } from './ClassNameExtractionService';
import { DiagnosticService } from './DiagnosticService';

/**
 * Service responsible for validating class names and creating diagnostics
 * Orchestrates the validation workflow
 */
export class ValidationService {
	constructor(
		private readonly extractionService: ClassNameExtractionService,
		private readonly diagnosticService: DiagnosticService,
		private readonly validator: IClassNameValidator,
		private readonly logger: Logger
	) {}

	/**
	 * Validate a source file and return diagnostics
	 * PERFORMANCE OPTIMIZED: Minimal logging overhead
	 */
	validateFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilityFunctions: string[],
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

		// PERFORMANCE: Only log if enabled
		if (this.logger.isEnabled()) {
			if (invalidClasses.length > 0) {
				this.logger.log(`[ValidationService] Returning ${invalidClasses.length} diagnostics`);
			} else {
				this.logger.log(`[ValidationService] No invalid classes found`);
			}
		}

		return invalidClasses.length > 0
			? this.diagnosticService.createDiagnostics(invalidClasses, sourceFile)
			: [];
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
}
