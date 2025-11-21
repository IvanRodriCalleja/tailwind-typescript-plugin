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

		this.logger.log(`[ValidationService] Processing file: ${sourceFile.fileName}`);

		// Extract all class names from the file
		const classNames = this.extractionService.extractFromSourceFile(
			typescript,
			sourceFile,
			utilityFunctions,
			typeChecker
		);

		this.logger.log(`[ValidationService] Found ${classNames.length} class names to validate`);

		// Filter invalid class names
		const invalidClasses = this.filterInvalidClasses(classNames);

		if (invalidClasses.length > 0) {
			this.logger.log(`[ValidationService] Returning ${invalidClasses.length} diagnostics`);
			return this.diagnosticService.createDiagnostics(invalidClasses, sourceFile);
		} else {
			this.logger.log(`[ValidationService] No invalid classes found`);
			return [];
		}
	}

	/**
	 * Filter out valid classes and return only invalid ones
	 */
	private filterInvalidClasses(classNames: ClassNameInfo[]): ClassNameInfo[] {
		return classNames.filter(classInfo => {
			const isValid = this.validator.isValidClass(classInfo.className);
			this.logger.log(
				`[ValidationService] Validating "${classInfo.className}": ${isValid ? 'VALID' : 'INVALID'}`
			);
			return !isValid;
		});
	}
}
