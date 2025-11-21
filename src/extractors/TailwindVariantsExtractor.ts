import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

/**
 * Extracts class names from tailwind-variants tv() function calls
 *
 * Supports:
 * - base: string with classes or array of strings
 * - variants: nested object with string values containing classes
 * - compoundVariants: array of objects with class/className properties
 * - slots: object where values contain classes
 * - Import aliasing: import { tv as myTv } from 'tailwind-variants'
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - ✅ Import detection cached per file (one-time AST scan)
 * - ✅ Early exits for non-tv calls (fast path)
 * - ✅ Direct property access (no unnecessary traversal)
 * - ✅ Inline hot paths (string literal extraction)
 * - ✅ Short-circuit evaluation (skip work when possible)
 */
export class TailwindVariantsExtractor extends BaseExtractor {
	private tvImportCache = new Map<string, Set<string>>();

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return context.typescript.isCallExpression(node);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		// OPTIMIZATION: Type guard first (fastest check)
		if (!context.typescript.isCallExpression(node)) {
			return [];
		}

		const callExpression = node as ts.CallExpression;

		// OPTIMIZATION: Check if this is a tv() call (includes import cache check)
		if (!this.isTvCall(callExpression, context)) {
			return [];
		}

		// OPTIMIZATION: Early exit for empty arguments
		if (callExpression.arguments.length === 0) {
			return [];
		}

		const configArg = callExpression.arguments[0];

		// OPTIMIZATION: Early exit if not an object literal
		if (!context.typescript.isObjectLiteralExpression(configArg)) {
			return [];
		}

		// Extract class names from the configuration object
		return this.extractFromTvConfig(configArg, context);
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
					classNames.push(
						...this.extractFromCompoundVariants(property.initializer, context)
					);
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
	private extractFromVariants(
		node: ts.Expression,
		context: ExtractionContext
	): ClassNameInfo[] {
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
	private extractFromSlots(
		node: ts.Expression,
		context: ExtractionContext
	): ClassNameInfo[] {
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
				}
			}
			return classNames;
		}

		// Template expression with variables: `flex ${something}`
		// For now, we extract only the static parts
		if (context.typescript.isTemplateExpression(node)) {
			const classNames: ClassNameInfo[] = [];
			const lineNumber =
				context.sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

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
	 * Clear the import cache (useful for testing or when files change)
	 */
	clearCache(): void {
		this.tvImportCache.clear();
	}
}
