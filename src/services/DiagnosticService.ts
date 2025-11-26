import * as ts from 'typescript/lib/tsserverlibrary';

import { IDiagnosticService } from '../core/interfaces';
import { ClassNameInfo } from '../core/types';

/**
 * Diagnostic code for Tailwind plugin errors (invalid class)
 * Used to identify our diagnostics for code actions
 */
export const TAILWIND_DIAGNOSTIC_CODE = 90001;

/**
 * Diagnostic code for duplicate class warnings
 */
export const TAILWIND_DUPLICATE_CODE = 90002;

/**
 * Diagnostic code for extractable class suggestions (hint)
 * Used when a class appears in all branches of a ternary but not at root level
 */
export const TAILWIND_EXTRACTABLE_CLASS_CODE = 90003;

/**
 * Service responsible for creating TypeScript diagnostics
 */
export class DiagnosticService implements IDiagnosticService {
	createDiagnostic(classInfo: ClassNameInfo, sourceFile: ts.SourceFile): ts.Diagnostic {
		let messageText = `The class "${classInfo.className}" is not a valid Tailwind class`;

		// Add context for variable references
		if (classInfo.variableUsage) {
			messageText += `. This value is used as className via variable "${classInfo.variableUsage.variableName}" on line ${classInfo.variableUsage.usageLine}`;
		}

		return {
			file: sourceFile,
			start: classInfo.absoluteStart,
			length: classInfo.length,
			messageText,
			category: ts.DiagnosticCategory.Error,
			code: TAILWIND_DIAGNOSTIC_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create a warning diagnostic for duplicate class
	 */
	createDuplicateDiagnostic(classInfo: ClassNameInfo, sourceFile: ts.SourceFile): ts.Diagnostic {
		let messageText = `Duplicate class "${classInfo.className}"`;

		// Add context for variable references
		if (classInfo.variableUsage) {
			messageText += `. This value comes from variable "${classInfo.variableUsage.variableName}" used on line ${classInfo.variableUsage.usageLine}`;
		}

		return {
			file: sourceFile,
			start: classInfo.absoluteStart,
			length: classInfo.length,
			messageText,
			category: ts.DiagnosticCategory.Warning,
			code: TAILWIND_DUPLICATE_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create multiple diagnostics from class info array
	 */
	createDiagnostics(classInfos: ClassNameInfo[], sourceFile: ts.SourceFile): ts.Diagnostic[] {
		return classInfos.map(classInfo => this.createDiagnostic(classInfo, sourceFile));
	}

	/**
	 * Create multiple duplicate warning diagnostics
	 */
	createDuplicateDiagnostics(
		classInfos: ClassNameInfo[],
		sourceFile: ts.SourceFile
	): ts.Diagnostic[] {
		return classInfos.map(classInfo => this.createDuplicateDiagnostic(classInfo, sourceFile));
	}

	/**
	 * Create a warning diagnostic for extractable class (appears in all ternary branches)
	 */
	createExtractableClassDiagnostic(
		classInfo: ClassNameInfo,
		sourceFile: ts.SourceFile
	): ts.Diagnostic {
		const messageText = `Class "${classInfo.className}" is repeated in both branches. Consider moving it outside the conditional.`;

		return {
			file: sourceFile,
			start: classInfo.absoluteStart,
			length: classInfo.length,
			messageText,
			category: ts.DiagnosticCategory.Warning,
			code: TAILWIND_EXTRACTABLE_CLASS_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create multiple extractable class hint diagnostics
	 */
	createExtractableClassDiagnostics(
		classInfos: ClassNameInfo[],
		sourceFile: ts.SourceFile
	): ts.Diagnostic[] {
		return classInfos.map(classInfo =>
			this.createExtractableClassDiagnostic(classInfo, sourceFile)
		);
	}
}
