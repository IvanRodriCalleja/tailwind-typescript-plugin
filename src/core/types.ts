import * as ts from 'typescript/lib/tsserverlibrary';

/**
 * Represents information about a class name found in source code
 */
export interface ClassNameInfo {
	className: string;
	absoluteStart: number;
	length: number;
	line: number;
	file: string;
	/**
	 * If this class name comes from a variable reference, this contains
	 * information about where the variable is used (for better error messages)
	 */
	variableUsage?: {
		variableName: string;
		usageLine: number;
	};
}

/**
 * Context provided to extractors for class name extraction
 */
export interface ExtractionContext {
	readonly typescript: typeof ts;
	readonly sourceFile: ts.SourceFile;
	readonly utilityFunctions: string[];
	readonly typeChecker?: ts.TypeChecker;
}

/**
 * Result of extraction operation
 */
export interface ExtractionResult {
	classNames: ClassNameInfo[];
}
