import * as ts from 'typescript/lib/tsserverlibrary';

import { IDiagnosticService } from '../core/interfaces';
import { ClassNameInfo } from '../core/types';

/**
 * Diagnostic code for Tailwind plugin errors
 * Used to identify our diagnostics for code actions
 */
export const TAILWIND_DIAGNOSTIC_CODE = 90001;

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
	 * Create multiple diagnostics from class info array
	 */
	createDiagnostics(classInfos: ClassNameInfo[], sourceFile: ts.SourceFile): ts.Diagnostic[] {
		return classInfos.map(classInfo => this.createDiagnostic(classInfo, sourceFile));
	}
}
