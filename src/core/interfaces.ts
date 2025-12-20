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
 * Base interface for class name extractors
 * Follows the Strategy pattern for extensibility
 */
export interface IClassNameExtractor {
	/**
	 * Determines if this extractor can handle the given node
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
