import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext, UtilityFunction, UtilityFunctionConfig } from '../core/types';

/**
 * Represents a resolved import mapping: local name -> module specifier
 * For example: { 'clsx': 'clsx', 'cn': '@/lib/utils' }
 */
type ImportMap = Map<string, string>;

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
		let isMemberExpression = false;

		// Handle simple function calls: clsx('flex')
		if (ts.isIdentifier(expr)) {
			functionName = expr.text;
		}
		// Handle member expressions: utils.cn('flex'), lib.clsx('flex')
		else if (ts.isPropertyAccessExpression(expr)) {
			functionName = expr.name.text;
			isMemberExpression = true;
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
					// For member expressions (utils.clsx), skip import verification
					// since we can't trace through object properties
					if (isMemberExpression) {
						return true;
					}
					// If we have context, verify the import source
					if (context) {
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
	 * - Namespace imports: import * as utils from 'clsx' (then utils.clsx)
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
	 * Get the import map for the current file
	 * Caches the result for performance
	 */
	private getImportMap(context: ExtractionContext): ImportMap {
		const fileName = context.sourceFile.fileName;

		// Check cache first
		if (this.importCache.has(fileName)) {
			return this.importCache.get(fileName)!;
		}

		// Build import map by scanning all import declarations
		const importMap: ImportMap = new Map();

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

			// Handle named imports: import { clsx } or import { clsx as cx }
			const namedBindings = importClause.namedBindings;
			if (namedBindings) {
				if (context.typescript.isNamedImports(namedBindings)) {
					for (const element of namedBindings.elements) {
						// element.name is the local name (what it's called in this file)
						// element.propertyName is the original export name (if aliased)
						importMap.set(element.name.text, moduleName);
					}
				}
				// Handle namespace imports: import * as utils from 'clsx'
				// For namespace imports, we'd need to track utils.* calls separately
				// For now, we don't add namespace imports to the map since they're accessed as properties
			}
		}

		// Cache the result
		this.importCache.set(fileName, importMap);

		return importMap;
	}

	/**
	 * Clear the import cache (useful for testing or when files change)
	 */
	clearImportCache(): void {
		this.importCache.clear();
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
