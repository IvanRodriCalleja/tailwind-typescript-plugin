import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from './types';

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
 * Interface for variant library configuration
 */
export interface IVariantsConfig {
	tailwindVariants?: boolean;
	classVarianceAuthority?: boolean;
}

/**
 * Interface for configuration management
 */
export interface IPluginConfig {
	globalCss?: string;
	utilityFunctions?: string[];
	variants?: IVariantsConfig;
	allowedClasses?: string[];
	enableLogging?: boolean;
}

/**
 * Interface for diagnostic creation
 */
export interface IDiagnosticService {
	createDiagnostic(classInfo: ClassNameInfo, sourceFile: ts.SourceFile): ts.Diagnostic;
}
