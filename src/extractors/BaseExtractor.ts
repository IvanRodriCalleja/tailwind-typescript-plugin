import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext, UtilityFunction, UtilityFunctionConfig } from '../core/types';

/**
 * Represents a resolved import mapping: local name -> module specifier
 * For example: { 'clsx': 'clsx', 'cn': '@/lib/utils' }
 */
type ImportMap = Map<string, string>;

/**
 * Represents namespace imports: local name -> module specifier
 * For example: { 'utils': 'clsx' } for `import * as utils from 'clsx'`
 */
type NamespaceImportMap = Map<string, string>;

/**
 * Abstract base class for all extractors
 * Provides common functionality and enforces the contract
 */
export abstract class BaseExtractor implements IClassNameExtractor {
	/**
	 * Cache for import mappings per file
	 * Maps filename -> (local identifier name -> module specifier)
	 */
	private importCache = new Map<string, ImportMap>();

	/**
	 * Cache for namespace import mappings per file
	 * Maps filename -> (namespace identifier -> module specifier)
	 */
	private namespaceImportCache = new Map<string, NamespaceImportMap>();

	abstract canHandle(node: ts.Node, context: ExtractionContext): boolean;
	abstract extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[];

	/**
	 * Helper method to create ClassNameInfo from a string literal
	 * Handles both single-line and multiline strings with various whitespace
	 */
	protected extractFromStringLiteral(
		literal: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral,
		context: ExtractionContext
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const fullText = literal.text;
		const stringContentStart = literal.getStart() + 1;
		let offset = 0;

		// Split by whitespace (including newlines, tabs, etc.) while tracking position
		const parts = fullText.split(/(\s+)/);
		for (const part of parts) {
			if (part && !/^\s+$/.test(part)) {
				// Non-whitespace part is a class name
				classNames.push({
					className: part,
					absoluteStart: stringContentStart + offset,
					length: part.length,
					line:
						context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line + 1,
					file: context.sourceFile.fileName
				});
			}
			offset += part.length;
		}

		return classNames;
	}

	/**
	 * Helper method to check if a function call should be validated
	 * Supports both simple string matching and precise import verification
	 */
	protected shouldValidateFunctionCall(
		callExpression: ts.CallExpression,
		utilityFunctions: UtilityFunction[],
		context?: ExtractionContext
	): boolean {
		const expr = callExpression.expression;
		let functionName: string | null = null;
		let objectName: string | null = null;

		// Handle simple function calls: clsx('flex')
		if (ts.isIdentifier(expr)) {
			functionName = expr.text;
		}
		// Handle member expressions: utils.cn('flex'), lib.clsx('flex')
		else if (ts.isPropertyAccessExpression(expr)) {
			functionName = expr.name.text;
			// Get the object name (e.g., 'utils' from 'utils.clsx')
			if (ts.isIdentifier(expr.expression)) {
				objectName = expr.expression.text;
			}
		}

		if (!functionName) {
			return false;
		}

		// Check each utility function configuration
		for (const utilityFunc of utilityFunctions) {
			if (typeof utilityFunc === 'string') {
				// Simple string: match by name only (backwards compatible)
				if (utilityFunc === functionName) {
					return true;
				}
			} else {
				// UtilityFunctionConfig: match by name AND verify import
				if (utilityFunc.name === functionName) {
					// If we have context, verify the import source
					if (context) {
						// For member expressions (utils.clsx), check if object is namespace imported
						if (objectName) {
							if (this.isNamespaceImportedFrom(objectName, utilityFunc.from, context)) {
								return true;
							}
							// Object is not a namespace import from expected package, skip
							continue;
						}
						// Direct function call - check direct import
						if (this.isImportedFrom(functionName, utilityFunc.from, context)) {
							return true;
						}
					} else {
						// No context available, fall back to name-only matching
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Check if a function name is imported from a specific module
	 * Supports:
	 * - Named imports: import { clsx } from 'clsx'
	 * - Aliased imports: import { clsx as cx } from 'clsx'
	 * - Default imports: import clsx from 'clsx'
	 */
	protected isImportedFrom(
		functionName: string,
		expectedModule: string,
		context: ExtractionContext
	): boolean {
		const importMap = this.getImportMap(context);
		const actualModule = importMap.get(functionName);

		if (!actualModule) {
			return false;
		}

		// Check for exact match or subpath match (e.g., 'tailwind-variants/lite' matches 'tailwind-variants')
		return actualModule === expectedModule || actualModule.startsWith(expectedModule + '/');
	}

	/**
	 * Check if an object name is a namespace import from a specific module
	 * For: import * as utils from 'clsx' -> utils.clsx('flex')
	 */
	protected isNamespaceImportedFrom(
		objectName: string,
		expectedModule: string,
		context: ExtractionContext
	): boolean {
		const namespaceMap = this.getNamespaceImportMap(context);
		const actualModule = namespaceMap.get(objectName);

		if (!actualModule) {
			return false;
		}

		// Check for exact match or subpath match
		return actualModule === expectedModule || actualModule.startsWith(expectedModule + '/');
	}

	/**
	 * Get the import map for the current file
	 * Caches the result for performance
	 */
	private getImportMap(context: ExtractionContext): ImportMap {
		const fileName = context.sourceFile.fileName;

		// Check cache first
		if (this.importCache.has(fileName)) {
			return this.importCache.get(fileName)!;
		}

		// Build both maps by scanning all import declarations
		this.buildImportMaps(context);

		return this.importCache.get(fileName)!;
	}

	/**
	 * Get the namespace import map for the current file
	 * Caches the result for performance
	 */
	private getNamespaceImportMap(context: ExtractionContext): NamespaceImportMap {
		const fileName = context.sourceFile.fileName;

		// Check cache first
		if (this.namespaceImportCache.has(fileName)) {
			return this.namespaceImportCache.get(fileName)!;
		}

		// Build both maps by scanning all import declarations
		this.buildImportMaps(context);

		return this.namespaceImportCache.get(fileName)!;
	}

	/**
	 * Build both import maps (regular and namespace) for the current file
	 */
	private buildImportMaps(context: ExtractionContext): void {
		const fileName = context.sourceFile.fileName;

		// Skip if already built
		if (this.importCache.has(fileName) && this.namespaceImportCache.has(fileName)) {
			return;
		}

		const importMap: ImportMap = new Map();
		const namespaceMap: NamespaceImportMap = new Map();

		for (const statement of context.sourceFile.statements) {
			if (!context.typescript.isImportDeclaration(statement)) {
				continue;
			}

			const moduleSpecifier = statement.moduleSpecifier;
			if (!context.typescript.isStringLiteral(moduleSpecifier)) {
				continue;
			}

			const moduleName = moduleSpecifier.text;
			const importClause = statement.importClause;

			if (!importClause) {
				continue;
			}

			// Handle default imports: import clsx from 'clsx'
			if (importClause.name) {
				importMap.set(importClause.name.text, moduleName);
			}

			// Handle named and namespace imports
			const namedBindings = importClause.namedBindings;
			if (namedBindings) {
				if (context.typescript.isNamedImports(namedBindings)) {
					// Named imports: import { clsx } or import { clsx as cx }
					for (const element of namedBindings.elements) {
						// element.name is the local name (what it's called in this file)
						importMap.set(element.name.text, moduleName);
					}
				} else if (context.typescript.isNamespaceImport(namedBindings)) {
					// Namespace imports: import * as utils from 'clsx'
					namespaceMap.set(namedBindings.name.text, moduleName);
				}
			}
		}

		// Cache both results
		this.importCache.set(fileName, importMap);
		this.namespaceImportCache.set(fileName, namespaceMap);
	}

	/**
	 * Clear the import cache (useful for testing or when files change)
	 */
	clearImportCache(): void {
		this.importCache.clear();
		this.namespaceImportCache.clear();
	}

	/**
	 * Check if a function name matches any utility function (by name only)
	 * Used for quick exclusion checks without import verification
	 */
	protected isUtilityFunctionName(
		functionName: string,
		utilityFunctions: UtilityFunction[]
	): boolean {
		for (const utilityFunc of utilityFunctions) {
			const name = typeof utilityFunc === 'string' ? utilityFunc : utilityFunc.name;
			if (name === functionName) {
				return true;
			}
		}
		return false;
	}
}
