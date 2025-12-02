import * as ts from 'typescript/lib/tsserverlibrary';

import { Framework } from '../utils/FrameworkDetector';

/**
 * Represents a utility function configuration with optional import source
 * When 'from' is specified, the import will be verified before matching
 *
 * Examples:
 * - { name: 'clsx', from: 'clsx' } - matches `import { clsx } from 'clsx'` or `import clsx from 'clsx'`
 * - { name: 'cn', from: '@/lib/utils' } - matches `import { cn } from '@/lib/utils'`
 *
 * @deprecated Use the new libraries.utilities config format instead
 */
export interface UtilityFunctionConfig {
	name: string;
	from: string;
}

/**
 * A utility function can be either:
 * - A simple string (matches by function name only, backwards compatible)
 * - A UtilityFunctionConfig object (matches by name AND verifies import source)
 *
 * @deprecated Use the new libraries.utilities config format instead
 */
export type UtilityFunction = string | UtilityFunctionConfig;

/**
 * Severity level for diagnostics
 */
export type DiagnosticSeverity = 'error' | 'warning' | 'suggestion' | 'off';

/**
 * Configuration for utilities (utility functions like cn, clsx, etc.)
 * Key is the function name, value is:
 * - string: import path (e.g., "clsx", "@/lib/utils")
 * - "*": match any import source
 * - "off": disable this utility function
 */
export type UtilitiesConfig = {
	[functionName: string]: string;
};

/**
 * Configuration for variant libraries
 */
export interface VariantsConfig {
	tailwindVariants?: boolean;
	classVarianceAuthority?: boolean;
}

/**
 * Configuration for libraries (utilities and variants)
 */
export interface LibrariesConfig {
	utilities?: UtilitiesConfig;
	variants?: VariantsConfig;
}

/**
 * Configuration for validation (invalid class detection)
 */
export interface ValidationConfig {
	enabled?: boolean;
	severity?: DiagnosticSeverity;
	allowedClasses?: string[];
}

/**
 * Configuration for a single lint rule
 */
export interface LintRuleConfig {
	enabled?: boolean;
	severity?: DiagnosticSeverity;
}

/**
 * Configuration for lint rules
 */
export interface LintConfig {
	enabled?: boolean;
	conflictingClasses?: LintRuleConfig;
	repeatedClasses?: LintRuleConfig;
}

/**
 * Configuration for autocomplete
 */
export interface AutocompleteConfig {
	enabled?: boolean;
}

/**
 * Configuration for hover information
 */
export interface HoverConfig {
	enabled?: boolean;
}

/**
 * Configuration for editor features
 */
export interface EditorConfig {
	enabled?: boolean;
	autocomplete?: AutocompleteConfig;
	hover?: HoverConfig;
}

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
	/**
	 * The detected framework for the current file
	 * Used to determine which extractor to use
	 */
	readonly framework?: Framework;
}

/**
 * Result of extraction operation
 */
export interface ExtractionResult {
	classNames: ClassNameInfo[];
}
