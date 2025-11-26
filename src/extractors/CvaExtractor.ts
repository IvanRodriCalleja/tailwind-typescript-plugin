import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';
import { VariableReferenceExtractor } from './VariableReferenceExtractor';

/**
 * Extracts class names from class-variance-authority cva() function calls
 *
 * Supports:
 * - base: array of strings or single string (first argument)
 * - variants: nested object with string/array values containing classes
 * - compoundVariants: array of objects with class/className properties
 * - boolean variants: { disabled: { true: [...], false: null } }
 * - Import aliasing: import { cva as myCva } from 'class-variance-authority'
 * - class property overrides: button({ intent: 'primary', class: 'extra-class' })
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - ✅ Import detection cached per file (one-time AST scan)
 * - ✅ Early exits for non-cva calls (fast path)
 * - ✅ Direct property access (no unnecessary traversal)
 * - ✅ Inline hot paths (string literal extraction)
 * - ✅ Short-circuit evaluation (skip work when possible)
 * - ✅ TypeChecker-based origin tracking (cached per symbol)
 */
export class CvaExtractor extends BaseExtractor {
	private cvaImportCache = new Map<string, Set<string>>();
	private cvaVariableCache = new Map<ts.Symbol, boolean>();
	private expressionExtractor: ExpressionExtractor;
	private variableExtractor: VariableReferenceExtractor;

	constructor() {
		super();
		this.expressionExtractor = new ExpressionExtractor();
		this.variableExtractor = new VariableReferenceExtractor();
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

		// OPTIMIZATION: Check if this is a cva() definition call
		if (this.isCvaCall(callExpression, context)) {
			return this.extractFromCvaDefinition(callExpression, context);
		}

		// Check if this is a call to a function created by cva() (e.g., button({ class: '...' }))
		// IMPORTANT: Only validate if NOT a utility function
		if (this.isCvaCreatedFunctionCall(callExpression, context)) {
			return this.extractFromCvaFunctionCall(callExpression, context);
		}

		return [];
	}

	/**
	 * Check if this call expression is a cva() call from class-variance-authority
	 * Supports import aliasing: import { cva as myCva } from 'class-variance-authority'
	 */
	private isCvaCall(callExpression: ts.CallExpression, context: ExtractionContext): boolean {
		const expr = callExpression.expression;
		const cvaNames = this.getCvaImportNames(context);

		// No cva imports found
		if (cvaNames.size === 0) {
			return false;
		}

		// Handle simple calls: cva(...) or myCva(...)
		if (context.typescript.isIdentifier(expr)) {
			return cvaNames.has(expr.text);
		}

		// Handle member expressions: variants.cva(...), utils.myCva(...)
		if (context.typescript.isPropertyAccessExpression(expr)) {
			return cvaNames.has(expr.name.text);
		}

		return false;
	}

	/**
	 * Get all local names for cva imports from class-variance-authority
	 * Supports aliasing: import { cva as myCva } -> returns Set(['myCva'])
	 * Caches result per file for performance
	 */
	private getCvaImportNames(context: ExtractionContext): Set<string> {
		const fileName = context.sourceFile.fileName;

		// Check cache first
		if (this.cvaImportCache.has(fileName)) {
			return this.cvaImportCache.get(fileName)!;
		}

		// Search for import statement
		const cvaNames = new Set<string>();

		for (const statement of context.sourceFile.statements) {
			if (!context.typescript.isImportDeclaration(statement)) {
				continue;
			}

			const moduleSpecifier = statement.moduleSpecifier;
			if (
				!context.typescript.isStringLiteral(moduleSpecifier) ||
				moduleSpecifier.text !== 'class-variance-authority'
			) {
				continue;
			}

			const importClause = statement.importClause;
			if (!importClause) {
				continue;
			}

			// Check named imports: import { cva } or import { cva as myCva }
			const namedBindings = importClause.namedBindings;
			if (namedBindings && context.typescript.isNamedImports(namedBindings)) {
				for (const element of namedBindings.elements) {
					// Check if the original export name is 'cva'
					// For: import { cva } -> propertyName is undefined, name is 'cva'
					// For: import { cva as myCva } -> propertyName is 'cva', name is 'myCva'
					const originalName = element.propertyName?.text || element.name.text;
					if (originalName === 'cva') {
						// Add the local name (what it's called in this file)
						cvaNames.add(element.name.text);
					}
				}
			}
		}

		// Cache the result
		this.cvaImportCache.set(fileName, cvaNames);

		return cvaNames;
	}

	/**
	 * Extract class names from cva() definition
	 * cva(['base', 'classes'], { variants: {...}, compoundVariants: [...] })
	 */
	private extractFromCvaDefinition(
		callExpression: ts.CallExpression,
		context: ExtractionContext
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// OPTIMIZATION: Early exit for empty arguments
		if (callExpression.arguments.length === 0) {
			return [];
		}

		// Generate unique attributeId for duplicate detection within this cva() call
		const attributeId = `cva:${callExpression.getStart()}-${callExpression.getEnd()}`;

		// First argument: base classes (array or string)
		const baseArg = callExpression.arguments[0];
		classNames.push(...this.extractFromValue(baseArg, context, attributeId));

		// Second argument: config object (optional)
		if (callExpression.arguments.length > 1) {
			const configArg = callExpression.arguments[1];
			if (context.typescript.isObjectLiteralExpression(configArg)) {
				classNames.push(...this.extractFromCvaConfig(configArg, context, attributeId));
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from cva() configuration object
	 */
	private extractFromCvaConfig(
		config: ts.ObjectLiteralExpression,
		context: ExtractionContext,
		attributeId?: string
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

			// Handle different cva() properties
			switch (propertyName) {
				case 'variants':
					// variants: { intent: { primary: [...], secondary: [...] } }
					classNames.push(...this.extractFromVariants(property.initializer, context, attributeId));
					break;

				case 'compoundVariants':
					// compoundVariants: [{ intent: 'primary', class: '...' }]
					classNames.push(
						...this.extractFromCompoundVariants(property.initializer, context, attributeId)
					);
					break;

				case 'defaultVariants':
					// defaultVariants doesn't contain classes, skip
					break;

				default:
					// Other properties might contain classes, try to extract
					classNames.push(...this.extractFromValue(property.initializer, context, attributeId));
					break;
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from the variants object
	 * Structure: { variantName: { optionName: 'classes' | ['classes'] | null } }
	 */
	private extractFromVariants(
		node: ts.Expression,
		context: ExtractionContext,
		attributeId?: string
	): ClassNameInfo[] {
		if (!context.typescript.isObjectLiteralExpression(node)) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		// Iterate through each variant (e.g., intent, size, disabled)
		for (const variantProp of node.properties) {
			if (!context.typescript.isPropertyAssignment(variantProp)) {
				continue;
			}

			// Each variant value should be an object with options
			if (context.typescript.isObjectLiteralExpression(variantProp.initializer)) {
				// Iterate through each option (e.g., primary, secondary, true, false)
				for (const optionProp of variantProp.initializer.properties) {
					if (!context.typescript.isPropertyAssignment(optionProp)) {
						continue;
					}

					// Extract classes from the option value (can be string, array, or null)
					const value = optionProp.initializer;

					// Skip null values (common for boolean variants: { false: null })
					if (
						context.typescript.isToken(value) &&
						value.kind === context.typescript.SyntaxKind.NullKeyword
					) {
						continue;
					}

					// Mark all classes from variants with isVariant: true
					const extracted = this.extractFromValue(value, context, attributeId);
					classNames.push(...extracted.map(c => ({ ...c, isVariant: true })));
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from compoundVariants array
	 * Structure: [{ condition: value, class: 'classes' | className: 'classes' }]
	 */
	private extractFromCompoundVariants(
		node: ts.Expression,
		context: ExtractionContext,
		attributeId?: string
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
					// Mark all classes from compoundVariants with isVariant: true
					const extracted = this.extractFromValue(prop.initializer, context, attributeId);
					classNames.push(...extracted.map(c => ({ ...c, isVariant: true })));
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from any expression value
	 * Handles: strings, arrays, template literals, variable references
	 */
	private extractFromValue(
		node: ts.Expression,
		context: ExtractionContext,
		attributeId?: string
	): ClassNameInfo[] {
		// String literal: 'flex items-center'
		if (context.typescript.isStringLiteral(node)) {
			const extracted = this.extractFromStringLiteral(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// No-substitution template literal: `flex items-center`
		if (context.typescript.isNoSubstitutionTemplateLiteral(node)) {
			const extracted = this.extractFromStringLiteral(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Identifier (variable reference): base: myBaseClasses
		if (context.typescript.isIdentifier(node)) {
			const extracted = this.variableExtractor.extractFromIdentifier(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Array: ['flex', 'items-center', myVar]
		if (context.typescript.isArrayLiteralExpression(node)) {
			const classNames: ClassNameInfo[] = [];
			for (const element of node.elements) {
				if (context.typescript.isStringLiteral(element)) {
					const extracted = this.extractFromStringLiteral(element, context);
					classNames.push(
						...(attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted)
					);
				} else if (context.typescript.isIdentifier(element)) {
					// Handle variable references in arrays
					const extracted = this.variableExtractor.extractFromIdentifier(element, context);
					classNames.push(
						...(attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted)
					);
				} else if (context.typescript.isExpression(element as ts.Expression)) {
					// Handle complex expressions in arrays (ternary, binary, etc.)
					const extracted = this.expressionExtractor.extractFromExpression(
						element as ts.Expression,
						context
					);
					classNames.push(
						...(attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted)
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
							file: context.sourceFile.fileName,
							attributeId
						});
					}
					offset += className.length + 1;
				});
			}

			// Extract from template spans
			for (const span of node.templateSpans) {
				if (span.literal.text) {
					const spanText = span.literal.text;
					const spanStart = span.literal.getStart() + 1;
					let offset = 0;

					spanText.split(' ').forEach(className => {
						if (className) {
							classNames.push({
								className,
								absoluteStart: spanStart + offset,
								length: className.length,
								line: lineNumber,
								file: context.sourceFile.fileName,
								attributeId
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
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Handle binary expressions: condition && 'class-name'
		if (context.typescript.isBinaryExpression(node)) {
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Handle parenthesized expressions: ('class-name')
		if (context.typescript.isParenthesizedExpression(node)) {
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Handle type assertions: ('class-name' as string)
		if (context.typescript.isAsExpression(node)) {
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Handle non-null assertions: expr!
		if (context.typescript.isNonNullExpression(node)) {
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		// Handle type assertions with angle brackets: <string>'class-name'
		if (context.typescript.isTypeAssertionExpression(node)) {
			const extracted = this.expressionExtractor.extractFromExpression(node, context);
			return attributeId ? extracted.map(c => ({ ...c, attributeId })) : extracted;
		}

		return [];
	}

	/**
	 * Check if this call expression is calling a function created by cva()
	 * Uses TypeChecker for accurate origin tracking
	 * IMPORTANT: Returns false for utility functions
	 */
	private isCvaCreatedFunctionCall(
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
			return false;
		}

		// Get the symbol for the called function
		const symbol = context.typeChecker.getSymbolAtLocation(expr);
		if (!symbol) {
			return false;
		}

		// OPTIMIZATION: Check cache first
		if (this.cvaVariableCache.has(symbol)) {
			return this.cvaVariableCache.get(symbol)!;
		}

		// Check if this symbol's declaration is assigned from a cva() call
		const isCvaCreated = this.isSymbolFromCvaCall(symbol, context);
		this.cvaVariableCache.set(symbol, isCvaCreated);

		return isCvaCreated;
	}

	/**
	 * Check if a symbol's declaration is from a cva() call
	 * Handles: const button = cva(...), export const button = cva(...), etc.
	 */
	private isSymbolFromCvaCall(symbol: ts.Symbol, context: ExtractionContext): boolean {
		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return false;
		}

		// Check each declaration to see if it's assigned from cva()
		for (const declaration of declarations) {
			// Handle: const button = cva(...)
			if (context.typescript.isVariableDeclaration(declaration)) {
				const initializer = declaration.initializer;
				if (initializer && context.typescript.isCallExpression(initializer)) {
					if (this.isCvaCall(initializer, context)) {
						return true;
					}
				}
			}
			// Handle: export default cva(...) or similar patterns
			else if (context.typescript.isExportAssignment(declaration)) {
				const expr = declaration.expression;
				if (context.typescript.isCallExpression(expr)) {
					if (this.isCvaCall(expr, context)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Extract class names from a cva() function call
	 * Example: button({ intent: 'primary', class: 'extra-class' })
	 */
	private extractFromCvaFunctionCall(
		callExpression: ts.CallExpression,
		context: ExtractionContext
	): ClassNameInfo[] {
		// OPTIMIZATION: Early exit for empty arguments
		if (callExpression.arguments.length === 0) {
			return [];
		}

		const arg = callExpression.arguments[0];

		// The argument should be an object literal with properties like { intent: 'primary', class: '...' }
		if (!context.typescript.isObjectLiteralExpression(arg)) {
			return [];
		}

		// Generate unique attributeId for duplicate detection within this cva function call
		const attributeId = `cva-call:${callExpression.getStart()}-${callExpression.getEnd()}`;
		const classNames: ClassNameInfo[] = [];

		// Look for 'class' or 'className' properties
		for (const property of arg.properties) {
			if (!context.typescript.isPropertyAssignment(property)) {
				continue;
			}

			const propName = this.getPropertyName(property, context);
			if (propName === 'class' || propName === 'className') {
				// Extract classes from the value
				classNames.push(...this.extractFromValue(property.initializer, context, attributeId));
			}
		}

		return classNames;
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
		this.cvaImportCache.clear();
		this.cvaVariableCache.clear();
	}
}
