import * as ts from 'typescript/lib/tsserverlibrary';

import { IDiagnosticService } from '../core/interfaces';
import { ClassNameInfo } from '../core/types';

/**
 * Service responsible for creating TypeScript diagnostics
 */
export class DiagnosticService implements IDiagnosticService {
	createDiagnostic(classInfo: ClassNameInfo, sourceFile: ts.SourceFile): ts.Diagnostic {
		return {
			file: sourceFile,
			start: classInfo.absoluteStart,
			length: classInfo.length,
			messageText: `The class "${classInfo.className}" is not a valid Tailwind class`,
			category: ts.DiagnosticCategory.Error,
			code: 9999,
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
