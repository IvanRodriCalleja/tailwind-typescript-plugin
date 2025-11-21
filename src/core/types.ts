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
