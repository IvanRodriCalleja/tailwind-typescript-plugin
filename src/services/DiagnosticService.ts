import * as ts from 'typescript/lib/tsserverlibrary';

import { IDiagnosticService } from '../core/interfaces';
import { ClassNameInfo, DiagnosticSeverity } from '../core/types';
import { ConflictInfo } from '../infrastructure/TailwindConflictDetector';

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
 * Diagnostic code for conflicting class warnings
 * Used when classes that affect the same CSS property are used together
 */
export const TAILWIND_CONFLICT_CODE = 90004;

/**
 * Convert our severity type to TypeScript's DiagnosticCategory
 */
function severityToCategory(severity: DiagnosticSeverity): ts.DiagnosticCategory {
	switch (severity) {
		case 'error':
			return ts.DiagnosticCategory.Error;
		case 'warning':
			return ts.DiagnosticCategory.Warning;
		case 'suggestion':
			return ts.DiagnosticCategory.Suggestion;
		case 'off':
			// This shouldn't be called if severity is 'off', but handle it gracefully
			return ts.DiagnosticCategory.Warning;
	}
}

/**
 * Service responsible for creating TypeScript diagnostics
 */
export class DiagnosticService implements IDiagnosticService {
	createDiagnostic(
		classInfo: ClassNameInfo,
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'error'
	): ts.Diagnostic {
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
			category: severityToCategory(severity),
			code: TAILWIND_DIAGNOSTIC_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create a warning diagnostic for duplicate class
	 */
	createDuplicateDiagnostic(
		classInfo: ClassNameInfo,
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'warning'
	): ts.Diagnostic {
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
			category: severityToCategory(severity),
			code: TAILWIND_DUPLICATE_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create multiple diagnostics from class info array
	 */
	createDiagnostics(
		classInfos: ClassNameInfo[],
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'error'
	): ts.Diagnostic[] {
		return classInfos.map(classInfo => this.createDiagnostic(classInfo, sourceFile, severity));
	}

	/**
	 * Create multiple duplicate warning diagnostics
	 */
	createDuplicateDiagnostics(
		classInfos: ClassNameInfo[],
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'warning'
	): ts.Diagnostic[] {
		return classInfos.map(classInfo =>
			this.createDuplicateDiagnostic(classInfo, sourceFile, severity)
		);
	}

	/**
	 * Create a hint diagnostic for extractable class (appears in all ternary branches)
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

	/**
	 * Create a warning diagnostic for conflicting class
	 */
	createConflictDiagnostic(
		conflictInfo: ConflictInfo,
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'warning'
	): ts.Diagnostic {
		const conflictingClassList = conflictInfo.conflictsWith.join(', ');
		let messageText = `Class "${conflictInfo.classInfo.className}" conflicts with "${conflictingClassList}". Both affect the ${conflictInfo.cssProperty} property.`;

		// Add context for variable references
		if (conflictInfo.classInfo.variableUsage) {
			messageText += ` This value comes from variable "${conflictInfo.classInfo.variableUsage.variableName}" used on line ${conflictInfo.classInfo.variableUsage.usageLine}`;
		}

		return {
			file: sourceFile,
			start: conflictInfo.classInfo.absoluteStart,
			length: conflictInfo.classInfo.length,
			messageText,
			category: severityToCategory(severity),
			code: TAILWIND_CONFLICT_CODE,
			source: 'tw-plugin'
		};
	}

	/**
	 * Create multiple conflict warning diagnostics
	 */
	createConflictDiagnostics(
		conflictInfos: ConflictInfo[],
		sourceFile: ts.SourceFile,
		severity: DiagnosticSeverity = 'warning'
	): ts.Diagnostic[] {
		return conflictInfos.map(conflictInfo =>
			this.createConflictDiagnostic(conflictInfo, sourceFile, severity)
		);
	}
}
