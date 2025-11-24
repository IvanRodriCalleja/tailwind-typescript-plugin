import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';

/**
 * Extracts class names from tailwind-variants tv() function calls
 *
 * Supports:
 * - base: string with classes or array of strings
 * - variants: nested object with string values containing classes
 * - compoundVariants: array of objects with class/className properties
 * - slots: object where values contain classes
 * - Import aliasing: import { tv as myTv } from 'tailwind-variants'
 * - class property overrides: button({ color: 'primary', class: 'bg-pink-500' })
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - ✅ Import detection cached per file (one-time AST scan)
 * - ✅ Early exits for non-tv calls (fast path)
 * - ✅ Direct property access (no unnecessary traversal)
 * - ✅ Inline hot paths (string literal extraction)
 * - ✅ Short-circuit evaluation (skip work when possible)
 * - ✅ TypeChecker-based origin tracking (cached per symbol)
 */
export class TailwindVariantsExtractor extends BaseExtractor {
	private tvImportCache = new Map<string, Set<string>>();
	private tvVariableCache = new Map<ts.Symbol, boolean>();
	private expressionExtractor: ExpressionExtractor;

	constructor() {
		super();
		this.expressionExtractor = new ExpressionExtractor();
	}

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return context.typescript.isCallExpression(node);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		// OPTIMIZATION: Type guard first (fastest check)
		if (!context.typescript.isCallExpression(node)) {
			return [];
		}

		const callExpression = node as ts.CallExpression;

		// OPTIMIZATION: Check if this is a tv() definition call
		if (this.isTvCall(callExpression, context)) {
			// OPTIMIZATION: Early exit for empty arguments
			if (callExpression.arguments.length === 0) {
				return [];
			}

			const configArg = callExpression.arguments[0];

			// OPTIMIZATION: Early exit if not an object literal
			if (!context.typescript.isObjectLiteralExpression(configArg)) {
				return [];
			}

			// Extract class names from the tv() configuration object
			return this.extractFromTvConfig(configArg, context);
		}

		// Check if this is a call to a function created by tv() (e.g., button({ class: '...' }))
		// IMPORTANT: Only validate if NOT a utility function
		if (this.isTvCreatedFunctionCall(callExpression, context)) {
			return this.extractFromTvFunctionCall(callExpression, context);
		}

		return [];
	}

	/**
	 * Check if this call expression is a tv() call from tailwind-variants
	 * Supports import aliasing: import { tv as myTv } from 'tailwind-variants'
	 */
	private isTvCall(callExpression: ts.CallExpression, context: ExtractionContext): boolean {
		const expr = callExpression.expression;
		const tvNames = this.getTvImportNames(context);

		// No tv imports found
		if (tvNames.size === 0) {
			return false;
		}

		// Handle simple calls: tv(...) or myTv(...)
		if (context.typescript.isIdentifier(expr)) {
			return tvNames.has(expr.text);
		}

		// Handle member expressions: variants.tv(...), utils.myTv(...)
		if (context.typescript.isPropertyAccessExpression(expr)) {
			return tvNames.has(expr.name.text);
		}

		return false;
	}

	/**
	 * Get all local names for tv imports from tailwind-variants
	 * Supports aliasing: import { tv as myTv } -> returns Set(['myTv'])
	 * Caches result per file for performance
	 */
	private getTvImportNames(context: ExtractionContext): Set<string> {
		const fileName = context.sourceFile.fileName;

		// Check cache first
		if (this.tvImportCache.has(fileName)) {
			return this.tvImportCache.get(fileName)!;
		}

		// Search for import statement
		const tvNames = new Set<string>();

		for (const statement of context.sourceFile.statements) {
			if (!context.typescript.isImportDeclaration(statement)) {
				continue;
			}

			const moduleSpecifier = statement.moduleSpecifier;
			if (
				!context.typescript.isStringLiteral(moduleSpecifier) ||
				moduleSpecifier.text !== 'tailwind-variants'
			) {
				continue;
			}

			const importClause = statement.importClause;
			if (!importClause) {
				continue;
			}

			// Check named imports: import { tv } or import { tv as myTv }
			const namedBindings = importClause.namedBindings;
			if (namedBindings && context.typescript.isNamedImports(namedBindings)) {
				for (const element of namedBindings.elements) {
					// Check if the original export name is 'tv'
					// For: import { tv } -> propertyName is undefined, name is 'tv'
					// For: import { tv as myTv } -> propertyName is 'tv', name is 'myTv'
					const originalName = element.propertyName?.text || element.name.text;
					if (originalName === 'tv') {
						// Add the local name (what it's called in this file)
						tvNames.add(element.name.text);
					}
				}
			}
		}

		// Cache the result
		this.tvImportCache.set(fileName, tvNames);

		return tvNames;
	}

	/**
	 * Extract class names from tv() configuration object
	 */
	private extractFromTvConfig(
		config: ts.ObjectLiteralExpression,
		context: ExtractionContext
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		for (const property of config.properties) {
			if (!context.typescript.isPropertyAssignment(property)) {
				continue;
			}

			const propertyName = this.getPropertyName(property, context);
			if (!propertyName) {
				continue;
			}

			// Handle different tv() properties
			switch (propertyName) {
				case 'base':
					// base: 'flex items-center' or base: ['flex', 'items-center']
					classNames.push(...this.extractFromValue(property.initializer, context));
					break;

				case 'variants':
					// variants: { size: { sm: 'text-sm', lg: 'text-lg' } }
					classNames.push(...this.extractFromVariants(property.initializer, context));
					break;

				case 'compoundVariants':
					// compoundVariants: [{ size: 'sm', color: 'primary', class: 'font-bold' }]
					classNames.push(...this.extractFromCompoundVariants(property.initializer, context));
					break;

				case 'slots':
					// slots: { base: 'flex', item: 'p-2' }
					classNames.push(...this.extractFromSlots(property.initializer, context));
					break;

				case 'defaultVariants':
					// defaultVariants doesn't contain classes, skip
					break;

				default:
					// Other properties might contain classes, try to extract
					classNames.push(...this.extractFromValue(property.initializer, context));
					break;
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from the variants object
	 * Structure: { variantName: { optionName: 'classes' } }
	 */
	private extractFromVariants(node: ts.Expression, context: ExtractionContext): ClassNameInfo[] {
		if (!context.typescript.isObjectLiteralExpression(node)) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		// Iterate through each variant (e.g., size, color)
		for (const variantProp of node.properties) {
			if (!context.typescript.isPropertyAssignment(variantProp)) {
				continue;
			}

			// Each variant value should be an object with options
			if (context.typescript.isObjectLiteralExpression(variantProp.initializer)) {
				// Iterate through each option (e.g., sm, lg, primary, secondary)
				for (const optionProp of variantProp.initializer.properties) {
					if (!context.typescript.isPropertyAssignment(optionProp)) {
						continue;
					}

					// Extract classes from the option value
					classNames.push(...this.extractFromValue(optionProp.initializer, context));
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from compoundVariants array
	 * Structure: [{ condition: value, class: 'classes' or className: 'classes' }]
	 */
	private extractFromCompoundVariants(
		node: ts.Expression,
		context: ExtractionContext
	): ClassNameInfo[] {
		if (!context.typescript.isArrayLiteralExpression(node)) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		// Iterate through each compound variant object
		for (const element of node.elements) {
			if (!context.typescript.isObjectLiteralExpression(element)) {
				continue;
			}

			// Look for 'class' or 'className' property
			for (const prop of element.properties) {
				if (!context.typescript.isPropertyAssignment(prop)) {
					continue;
				}

				const propName = this.getPropertyName(prop, context);
				if (propName === 'class' || propName === 'className') {
					classNames.push(...this.extractFromValue(prop.initializer, context));
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from slots object
	 * Structure: { slotName: 'classes' } or { slotName: { base: 'classes', variants: {...} } }
	 */
	private extractFromSlots(node: ts.Expression, context: ExtractionContext): ClassNameInfo[] {
		if (!context.typescript.isObjectLiteralExpression(node)) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		for (const slotProp of node.properties) {
			if (!context.typescript.isPropertyAssignment(slotProp)) {
				continue;
			}

			const slotValue = slotProp.initializer;

			// If slot value is a string, extract classes
			if (context.typescript.isStringLiteral(slotValue)) {
				classNames.push(...this.extractFromStringLiteral(slotValue, context));
			}
			// If slot value is an object with base/variants, recurse
			else if (context.typescript.isObjectLiteralExpression(slotValue)) {
				classNames.push(...this.extractFromTvConfig(slotValue, context));
			}
			// Handle arrays and other expressions
			else {
				classNames.push(...this.extractFromValue(slotValue, context));
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from any expression value
	 */
	private extractFromValue(node: ts.Expression, context: ExtractionContext): ClassNameInfo[] {
		// String literal: 'flex items-center'
		if (context.typescript.isStringLiteral(node)) {
			return this.extractFromStringLiteral(node, context);
		}

		// No-substitution template literal: `flex items-center`
		if (context.typescript.isNoSubstitutionTemplateLiteral(node)) {
			return this.extractFromStringLiteral(node, context);
		}

		// Array: ['flex', 'items-center']
		if (context.typescript.isArrayLiteralExpression(node)) {
			const classNames: ClassNameInfo[] = [];
			for (const element of node.elements) {
				if (context.typescript.isStringLiteral(element)) {
					classNames.push(...this.extractFromStringLiteral(element, context));
				} else if (context.typescript.isExpression(element as ts.Expression)) {
					// Handle complex expressions in arrays (ternary, binary, etc.)
					classNames.push(
						...this.expressionExtractor.extractFromExpression(element as ts.Expression, context)
					);
				}
			}
			return classNames;
		}

		// Template expression with variables: `flex ${something}`
		// For now, we extract only the static parts
		if (context.typescript.isTemplateExpression(node)) {
			const classNames: ClassNameInfo[] = [];
			const lineNumber = context.sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

			// Extract from head
			if (node.head.text) {
				const headText = node.head.text;
				const headStart = node.head.getStart() + 1; // +1 to skip backtick
				let offset = 0;

				headText.split(' ').forEach(className => {
					if (className) {
						classNames.push({
							className,
							absoluteStart: headStart + offset,
							length: className.length,
							line: lineNumber,
							file: context.sourceFile.fileName
						});
					}
					offset += className.length + 1;
				});
			}

			// Extract from template spans
			for (const span of node.templateSpans) {
				if (span.literal.text) {
					const spanText = span.literal.text;
					const spanStart = span.literal.getStart() + 1; // +1 to skip template literal quote
					let offset = 0;

					spanText.split(' ').forEach(className => {
						if (className) {
							classNames.push({
								className,
								absoluteStart: spanStart + offset,
								length: className.length,
								line: lineNumber,
								file: context.sourceFile.fileName
							});
						}
						offset += className.length + 1;
					});
				}
			}
			return classNames;
		}

		// Handle ternary expressions: condition ? 'class1' : 'class2'
		if (context.typescript.isConditionalExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		// Handle binary expressions: condition && 'class-name'
		if (context.typescript.isBinaryExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		// Handle parenthesized expressions: ('class-name')
		if (context.typescript.isParenthesizedExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		// Handle type assertions: ('class-name' as string)
		if (context.typescript.isAsExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		// Handle non-null assertions: expr!
		if (context.typescript.isNonNullExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		// Handle type assertions with angle brackets: <string>'class-name'
		if (context.typescript.isTypeAssertionExpression(node)) {
			return this.expressionExtractor.extractFromExpression(node, context);
		}

		return [];
	}

	/**
	 * Get property name from a property assignment
	 */
	private getPropertyName(
		property: ts.PropertyAssignment,
		context: ExtractionContext
	): string | null {
		const name = property.name;

		if (context.typescript.isIdentifier(name)) {
			return name.text;
		}

		if (context.typescript.isStringLiteral(name)) {
			return name.text;
		}

		return null;
	}

	/**
	 * Check if this call expression is calling a function created by tv()
	 * Uses TypeChecker for accurate origin tracking
	 * IMPORTANT: Returns false for utility functions
	 */
	private isTvCreatedFunctionCall(
		callExpression: ts.CallExpression,
		context: ExtractionContext
	): boolean {
		// OPTIMIZATION: Early exit if no type checker available
		if (!context.typeChecker) {
			return false;
		}

		const expr = callExpression.expression;

		// OPTIMIZATION: Only handle simple identifiers and property access
		// This covers: button(...), variants.button(...), etc.
		if (
			!context.typescript.isIdentifier(expr) &&
			!context.typescript.isPropertyAccessExpression(expr)
		) {
			return false;
		}

		// OPTIMIZATION: Check if this is a utility function (exclude from validation)
		const functionName = context.typescript.isIdentifier(expr)
			? expr.text
			: context.typescript.isPropertyAccessExpression(expr)
				? expr.name.text
				: null;

		if (functionName && context.utilityFunctions.includes(functionName)) {
			// Debug: log when skipping utility function
			// console.log(`[TV] Skipping utility function: ${functionName}`);
			return false;
		}

		// Debug: log function being checked
		// console.log(`[TV] Checking if ${functionName} is tv-created, utility functions:`, context.utilityFunctions);

		// Get the symbol for the called function
		const symbol = context.typeChecker.getSymbolAtLocation(expr);
		if (!symbol) {
			return false;
		}

		// OPTIMIZATION: Check cache first
		if (this.tvVariableCache.has(symbol)) {
			return this.tvVariableCache.get(symbol)!;
		}

		// Check if this symbol's declaration is assigned from a tv() call
		const isTvCreated = this.isSymbolFromTvCall(symbol, context);
		this.tvVariableCache.set(symbol, isTvCreated);

		return isTvCreated;
	}

	/**
	 * Check if a symbol's declaration is from a tv() call
	 * Handles: const button = tv(...), export const button = tv(...), etc.
	 */
	private isSymbolFromTvCall(symbol: ts.Symbol, context: ExtractionContext): boolean {
		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return false;
		}

		// Check each declaration to see if it's assigned from tv()
		for (const declaration of declarations) {
			// Handle: const button = tv(...)
			if (context.typescript.isVariableDeclaration(declaration)) {
				const initializer = declaration.initializer;
				if (initializer && context.typescript.isCallExpression(initializer)) {
					if (this.isTvCall(initializer, context)) {
						return true;
					}
				}
			}
			// Handle: export default tv(...) or similar patterns
			else if (context.typescript.isExportAssignment(declaration)) {
				const expr = declaration.expression;
				if (context.typescript.isCallExpression(expr)) {
					if (this.isTvCall(expr, context)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Extract class names from a tv() function call
	 * Example: button({ color: 'primary', class: 'bg-pink-500' })
	 */
	private extractFromTvFunctionCall(
		callExpression: ts.CallExpression,
		context: ExtractionContext
	): ClassNameInfo[] {
		// OPTIMIZATION: Early exit for empty arguments
		if (callExpression.arguments.length === 0) {
			return [];
		}

		const arg = callExpression.arguments[0];

		// The argument should be an object literal with properties like { color: 'primary', class: '...' }
		if (!context.typescript.isObjectLiteralExpression(arg)) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		// Look for 'class' or 'className' properties
		for (const property of arg.properties) {
			if (!context.typescript.isPropertyAssignment(property)) {
				continue;
			}

			const propName = this.getPropertyName(property, context);
			if (propName === 'class' || propName === 'className') {
				// Extract classes from the value
				classNames.push(...this.extractFromValue(property.initializer, context));
			}
		}

		return classNames;
	}

	/**
	 * Clear the import cache (useful for testing or when files change)
	 */
	clearCache(): void {
		this.tvImportCache.clear();
		this.tvVariableCache.clear();
	}
}
