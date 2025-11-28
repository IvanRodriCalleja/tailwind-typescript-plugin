import * as ts from 'typescript/lib/tsserverlibrary';

/**
 * Represents a utility function configuration with optional import source
 * When 'from' is specified, the import will be verified before matching
 *
 * Examples:
 * - { name: 'clsx', from: 'clsx' } - matches `import { clsx } from 'clsx'` or `import clsx from 'clsx'`
 * - { name: 'cn', from: '@/lib/utils' } - matches `import { cn } from '@/lib/utils'`
 */
export interface UtilityFunctionConfig {
	name: string;
	from: string;
}

/**
 * A utility function can be either:
 * - A simple string (matches by function name only, backwards compatible)
 * - A UtilityFunctionConfig object (matches by name AND verifies import source)
 */
export type UtilityFunction = string | UtilityFunctionConfig;

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
	/**
	 * Indicates if this class comes from a variant context in tv() or cva().
	 * - undefined or false: Class is from base/root (always applied)
	 * - true: Class is from a variant (only applied when variant is selected)
	 * Used to avoid flagging conflicts between base and variant classes,
	 * since variants are intentionally designed to override base styles.
	 */
	isVariant?: boolean;
}

/**
 * Context provided to extractors for class name extraction
 */
export interface ExtractionContext {
	readonly typescript: typeof ts;
	readonly sourceFile: ts.SourceFile;
	readonly utilityFunctions: UtilityFunction[];
	readonly typeChecker?: ts.TypeChecker;
}

/**
 * Result of extraction operation
 */
export interface ExtractionResult {
	classNames: ClassNameInfo[];
}
