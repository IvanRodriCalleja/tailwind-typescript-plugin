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
	/**
	 * Unique identifier for the className attribute/context this class belongs to.
	 * Used for duplicate detection - duplicates are only flagged within the same attribute.
	 * Format: "start:end" of the parent attribute node.
	 */
	attributeId?: string;
	/**
	 * Identifies which conditional branch this class belongs to.
	 * - undefined or 'root': Class is at root level (always applied)
	 * - 'ternary:true:N': Class is in the true branch of ternary N
	 * - 'ternary:false:N': Class is in the false branch of ternary N
	 * Used to distinguish true duplicates from classes repeated in mutually exclusive branches.
	 */
	conditionalBranchId?: string;
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
