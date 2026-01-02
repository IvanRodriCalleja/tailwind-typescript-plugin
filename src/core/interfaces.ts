import * as ts from 'typescript/lib/tsserverlibrary';

import {
	ClassAttributesConfig,
	ClassNameInfo,
	EditorConfig,
	ExtractionContext,
	LibrariesConfig,
	LintConfig,
	ValidationConfig
} from './types';

/**
 * Type for node filter functions used by extractors
 * Returns true if the node might contain class names worth extracting
 */
export type NodeFilterFn = (node: ts.Node, typescript: typeof ts) => boolean;

/**
 * Base interface for class name extractors
 * Follows the Strategy pattern for extensibility
 */
export interface IClassNameExtractor {
	/**
	 * Returns a fast filter function to pre-screen nodes before calling canHandle().
	 * This enables ~95-98% of nodes to be skipped with a simple type check,
	 * avoiding the overhead of polymorphic canHandle() calls.
	 *
	 * Each extractor defines its own filter based on the node types it handles:
	 * - JSX: Only JsxOpeningElement or JsxSelfClosingElement nodes
	 * - Vue: Only CallExpression nodes (Volar transforms templates to calls)
	 */
	getNodeFilter(): NodeFilterFn;

	/**
	 * Determines if this extractor can handle the given node.
	 * Called only after getNodeFilter() returns true.
	 */
	canHandle(node: ts.Node, context: ExtractionContext): boolean;

	/**
	 * Extracts class names from the given node
	 */
	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[];
}

/**
 * Interface for class name validators
 */
export interface IClassNameValidator {
	isValidClass(className: string): boolean;
	isInitialized(): boolean;
	setAllowedClasses(allowedClasses: string[]): void;
}

/**
 * Interface for configuration management
 */
export interface IPluginConfig {
	globalCss?: string;

	/**
	 * Library configurations (utilities and variants)
	 */
	libraries?: LibrariesConfig;

	/**
	 * Validation configuration (invalid class detection)
	 */
	validation?: ValidationConfig;

	/**
	 * Lint configuration (conflicting and repeated classes)
	 */
	lint?: LintConfig;

	/**
	 * Editor features configuration (autocomplete and hover)
	 */
	editor?: EditorConfig;

	/**
	 * Additional attribute names to treat as class attributes
	 * These are merged with defaults (className, class, classList)
	 * Example: ["containerStyles", "textStyles"]
	 */
	classAttributes?: ClassAttributesConfig;
}

/**
 * Interface for diagnostic creation
 */
export interface IDiagnosticService {
	createDiagnostic(classInfo: ClassNameInfo, sourceFile: ts.SourceFile): ts.Diagnostic;
}
