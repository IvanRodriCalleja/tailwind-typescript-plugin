import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext, UtilityFunction } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { VueExpressionExtractor } from './VueExpressionExtractor';

/**
 * Extracts class names from Vue template class attributes
 *
 * When @vue/language-tools (Volar) transforms Vue SFC templates, it generates
 * TypeScript code using function calls with object spreads:
 *
 * ```typescript
 * __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
 *   ...{ class: "flex items-center" },
 * });
 * ```
 *
 * For dynamic classes:
 * ```typescript
 * __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
 *   ...{ class: ({ 'bg-red-500': isActive }) },
 * });
 * ```
 *
 * This extractor handles these patterns to extract class names.
 */
export class VueAttributeExtractor extends BaseExtractor {
	private expressionExtractor: VueExpressionExtractor;

	constructor() {
		super();
		this.expressionExtractor = new VueExpressionExtractor();
	}

	/**
	 * Override to handle Vue's __VLS_ctx pattern.
	 *
	 * Vue generates code like __VLS_ctx.clsx(...) for template expressions
	 * where clsx is imported in the script section. We need to check if the
	 * function name (not __VLS_ctx) is directly imported.
	 */
	protected override shouldValidateFunctionCall(
		callExpression: ts.CallExpression,
		utilityFunctions: UtilityFunction[],
		context?: ExtractionContext
	): boolean {
		// First, check if this is a __VLS_ctx.functionName() pattern
		if (context) {
			const expr = callExpression.expression;
			if (context.typescript.isPropertyAccessExpression(expr)) {
				const objectExpr = expr.expression;
				if (context.typescript.isIdentifier(objectExpr) && objectExpr.text === '__VLS_ctx') {
					const functionName = expr.name.text;

					// Check each utility function configuration
					for (const utilityFunc of utilityFunctions) {
						if (typeof utilityFunc === 'string') {
							if (utilityFunc === functionName) {
								return true;
							}
						} else if (utilityFunc.name === functionName) {
							// Check if the function is directly imported from expected module
							if (this.isImportedFrom(functionName, utilityFunc.from, context)) {
								return true;
							}
						}
					}
					return false;
				}
			}
		}

		// Fall back to base implementation for non-Vue patterns
		return super.shouldValidateFunctionCall(callExpression, utilityFunctions, context);
	}

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		// We handle call expressions that look like Vue's generated element calls
		// Pattern: __VLS_asFunctionalElement(...)({ ...{ class: ... } })
		if (!context.typescript.isCallExpression(node)) {
			return false;
		}

		// Check if this is a chained call (the outer call to the element function)
		// The pattern is: func(...)({...}) where the result of func(...) is called again
		const expression = node.expression;
		if (!context.typescript.isCallExpression(expression)) {
			return false;
		}

		// Check if the arguments contain an object with spread that has a 'class' property
		if (node.arguments.length === 0) {
			return false;
		}

		const firstArg = node.arguments[0];
		if (!context.typescript.isObjectLiteralExpression(firstArg)) {
			return false;
		}

		// Look for spread assignments with 'class' property
		return this.hasClassSpreadProperty(firstArg, context);
	}

	private hasClassSpreadProperty(
		obj: ts.ObjectLiteralExpression,
		context: ExtractionContext
	): boolean {
		for (const prop of obj.properties) {
			if (context.typescript.isSpreadAssignment(prop)) {
				const spreadExpr = prop.expression;
				if (context.typescript.isObjectLiteralExpression(spreadExpr)) {
					for (const innerProp of spreadExpr.properties) {
						if (context.typescript.isPropertyAssignment(innerProp)) {
							const name = innerProp.name;
							if (context.typescript.isIdentifier(name) && name.text === 'class') {
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		if (!context.typescript.isCallExpression(node)) {
			return classNames;
		}

		const firstArg = node.arguments[0];
		if (!firstArg || !context.typescript.isObjectLiteralExpression(firstArg)) {
			return classNames;
		}

		// Find spread assignments with 'class' property
		for (const prop of firstArg.properties) {
			if (!context.typescript.isSpreadAssignment(prop)) {
				continue;
			}

			const spreadExpr = prop.expression;
			if (!context.typescript.isObjectLiteralExpression(spreadExpr)) {
				continue;
			}

			for (const innerProp of spreadExpr.properties) {
				if (!context.typescript.isPropertyAssignment(innerProp)) {
					continue;
				}

				const name = innerProp.name;
				if (!context.typescript.isIdentifier(name) || name.text !== 'class') {
					continue;
				}

				const value = innerProp.initializer;
				const attributeId = `${innerProp.getStart()}-${innerProp.getEnd()}`;

				// Handle different class value types
				classNames.push(...this.extractClassesFromValue(value, context, attributeId));
			}
		}

		return classNames;
	}

	private extractClassesFromValue(
		value: ts.Expression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Static string literal: class: "flex items-center"
		if (context.typescript.isStringLiteral(value)) {
			const fullText = value.text;
			if (fullText.length === 0) {
				return classNames;
			}

			const stringContentStart = value.getStart() + 1;
			let offset = 0;

			const parts = fullText.split(/(\s+)/);
			for (const part of parts) {
				if (part && !/^\s+$/.test(part)) {
					classNames.push({
						className: part,
						absoluteStart: stringContentStart + offset,
						length: part.length,
						line:
							context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line +
							1,
						file: context.sourceFile.fileName,
						attributeId
					});
				}
				offset += part.length;
			}
			return classNames;
		}

		// Object literal for dynamic classes: class: { 'bg-red-500': isActive }
		// Or wrapped in parentheses: class: ({ 'bg-red-500': isActive })
		let objectExpr: ts.ObjectLiteralExpression | undefined;

		if (context.typescript.isObjectLiteralExpression(value)) {
			objectExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (context.typescript.isObjectLiteralExpression(inner)) {
				objectExpr = inner;
			}
		}

		if (objectExpr) {
			for (const prop of objectExpr.properties) {
				if (context.typescript.isPropertyAssignment(prop)) {
					const propName = prop.name;
					let className: string | undefined;
					let start: number | undefined;

					// Handle string literal keys: { 'bg-red-500': true }
					if (context.typescript.isStringLiteral(propName)) {
						className = propName.text;
						start = propName.getStart() + 1; // Skip opening quote
					}
					// Handle identifier keys: { flex: true }
					else if (context.typescript.isIdentifier(propName)) {
						className = propName.text;
						start = propName.getStart();
					}

					if (className && start !== undefined) {
						classNames.push({
							className,
							absoluteStart: start,
							length: className.length,
							line: context.sourceFile.getLineAndCharacterOfPosition(start).line + 1,
							file: context.sourceFile.fileName,
							attributeId
						});
					}
				}
				// Handle shorthand properties: { flex }
				else if (context.typescript.isShorthandPropertyAssignment(prop)) {
					const className = prop.name.text;
					const start = prop.name.getStart();
					classNames.push({
						className,
						absoluteStart: start,
						length: className.length,
						line: context.sourceFile.getLineAndCharacterOfPosition(start).line + 1,
						file: context.sourceFile.fileName,
						attributeId
					});
				}
			}
			return classNames;
		}

		// Array literal: class: ['flex', 'items-center']
		// Vue wraps expressions in parentheses: class: (['flex', 'items-center'])
		let arrayExpr: ts.ArrayLiteralExpression | undefined;
		if (context.typescript.isArrayLiteralExpression(value)) {
			arrayExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (context.typescript.isArrayLiteralExpression(inner)) {
				arrayExpr = inner;
			}
		}

		if (arrayExpr) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			return addAttributeId(this.expressionExtractor.extract(arrayExpr, context));
		}

		// Template literal or other expressions - delegate to expression extractor
		// Vue wraps expressions in parentheses: class: (`flex items-center`)
		let templateExpr: ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral | undefined;
		if (
			context.typescript.isTemplateExpression(value) ||
			context.typescript.isNoSubstitutionTemplateLiteral(value)
		) {
			templateExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (
				context.typescript.isTemplateExpression(inner) ||
				context.typescript.isNoSubstitutionTemplateLiteral(inner)
			) {
				templateExpr = inner;
			}
		}

		if (templateExpr) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			return addAttributeId(this.expressionExtractor.extract(templateExpr, context));
		}

		// Call expression (utility functions like cn, clsx)
		// Vue wraps expressions in parentheses: class: (__VLS_ctx.clsx(...))
		let callExpr: ts.CallExpression | undefined;
		if (context.typescript.isCallExpression(value)) {
			callExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (context.typescript.isCallExpression(inner)) {
				callExpr = inner;
			}
		}

		if (callExpr && this.shouldValidateFunctionCall(callExpr, context.utilityFunctions, context)) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			return addAttributeId(this.expressionExtractor.extract(callExpr, context));
		}

		// Handle __VLS_ctx.propertyName patterns for variable/computed/function references
		// Vue generates: class: (__VLS_ctx.myClass) for :class="myClass"
		const resolvedClasses = this.extractFromVlsCtxReference(value, context, attributeId);
		if (resolvedClasses.length > 0) {
			return resolvedClasses;
		}

		return classNames;
	}

	/**
	 * Extract classes from __VLS_ctx patterns by resolving variable/function references.
	 *
	 * Vue's generated code transforms template expressions in two ways:
	 * - :class="myClass" becomes class: (__VLS_ctx.myClass) - property access
	 * - :class="getClasses()" becomes class: (__VLS_ctx.getClasses()) - call expression
	 *
	 * The symbol resolves to a property assignment in Vue's generated code like:
	 * `return { myClass: myClass as typeof myClass }` or
	 * `return { getClasses: getClasses as typeof getClasses }`
	 * We need to follow the reference chain to find the actual declaration.
	 *
	 * IMPORTANT: We use the TEMPLATE position (the propertyName in __VLS_ctx.propertyName)
	 * for diagnostics because Volar only maps diagnostics from the template-generated section,
	 * not from the script section. Script section positions have valid mappings but Volar
	 * doesn't apply them for diagnostics.
	 */
	private extractFromVlsCtxReference(
		value: ts.Expression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		// Unwrap parenthesized expression if present
		let expr = value;
		if (typescript.isParenthesizedExpression(expr)) {
			expr = expr.expression;
		}

		// Handle call expressions: __VLS_ctx.getClasses()
		if (typescript.isCallExpression(expr)) {
			const calleeExpr = expr.expression;
			if (typescript.isPropertyAccessExpression(calleeExpr)) {
				const objectExpr = calleeExpr.expression;
				if (typescript.isIdentifier(objectExpr) && objectExpr.text === '__VLS_ctx') {
					const functionName = calleeExpr.name;
					if (typescript.isIdentifier(functionName)) {
						// Use the function name position in template for diagnostics
						const templatePosition = functionName.getStart();
						const templateLength = functionName.text.length;
						return this.extractFromVlsCtxFunctionCall(
							functionName,
							context,
							attributeId,
							templatePosition,
							templateLength
						);
					}
				}
			}
			return [];
		}

		// Check if this is a __VLS_ctx.propertyName pattern (property access)
		if (!typescript.isPropertyAccessExpression(expr)) {
			return [];
		}

		const objectExpr = expr.expression;
		if (!typescript.isIdentifier(objectExpr) || objectExpr.text !== '__VLS_ctx') {
			return [];
		}

		// Get the property name identifier (e.g., 'myClass' from __VLS_ctx.myClass)
		const propertyName = expr.name;

		// Vue's generated code uses regular identifiers, not private identifiers
		if (!typescript.isIdentifier(propertyName)) {
			return [];
		}

		// IMPORTANT: Use the template position (propertyName) for diagnostics
		// This position has a valid Volar mapping that will be applied in the IDE
		const templatePosition = propertyName.getStart();
		const templateLength = propertyName.text.length;

		// Use the type checker to resolve the symbol
		const symbol = typeChecker.getSymbolAtLocation(propertyName);
		if (!symbol) {
			return [];
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];
		// Keep original positions - diagnostic will point to where class is defined
		const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
			classes.map(c => ({
				...c,
				attributeId
			}));

		for (const declaration of declarations) {
			// Handle variable declarations: const myClass = 'flex items-center'
			if (typescript.isVariableDeclaration(declaration)) {
				const initializer = declaration.initializer;
				if (initializer) {
					// Check if this is a computed() call
					if (typescript.isCallExpression(initializer)) {
						const computedClasses = this.extractFromComputedCall(
							initializer,
							context,
							attributeId,
							templatePosition,
							templateLength
						);
						if (computedClasses.length > 0) {
							classNames.push(...computedClasses);
							continue;
						}
					}

					// For regular variables, extract classes from the initializer
					// Keep original position from string literal
					classNames.push(...addAttributeId(this.extractFromExpression(initializer, context)));
				}
			}
			// Handle function declarations: function getClasses() { return [...] }
			else if (typescript.isFunctionDeclaration(declaration)) {
				const funcClasses = this.extractFromFunctionDeclaration(
					declaration,
					context,
					attributeId,
					templatePosition,
					templateLength
				);
				classNames.push(...funcClasses);
			}
			// Handle property assignments in Vue's generated code:
			// `return { myClass: myClass as typeof myClass }`
			// The declaration is the PropertyAssignment, and we need to follow the reference
			else if (typescript.isPropertyAssignment(declaration)) {
				const initializer = declaration.initializer;
				// Follow the reference: `myClass as typeof myClass` or just `myClass`
				const resolvedClasses = this.resolvePropertyAssignmentClasses(
					initializer,
					context,
					attributeId,
					templatePosition,
					templateLength
				);
				classNames.push(...resolvedClasses);
			}
			// Handle shorthand property assignments: `return { myClass }`
			else if (typescript.isShorthandPropertyAssignment(declaration)) {
				// The name itself is the reference to the variable
				const resolvedClasses = this.resolveIdentifierClasses(
					declaration.name,
					context,
					attributeId,
					templatePosition,
					templateLength
				);
				classNames.push(...resolvedClasses);
			}
			// Handle property signatures in Volar 3.x:
			// type __VLS_SetupExposed = { myClass: typeof myClass; }
			// The type is a string literal type that contains the class value
			else if (typescript.isPropertySignature(declaration)) {
				const resolvedClasses = this.extractFromPropertySignatureType(
					propertyName,
					context,
					attributeId
				);
				classNames.push(...resolvedClasses);
			}
		}

		return classNames;
	}

	/**
	 * Extract classes from a PropertySignature by getting the type.
	 *
	 * In Volar 3.x, script variables are exposed via a type like:
	 * type __VLS_SetupExposed = { myClass: typeof myClass; }
	 *
	 * We prioritize finding the actual variable declaration to use original positions,
	 * so errors point to the actual class strings in the script section.
	 */
	private extractFromPropertySignatureType(
		identifier: ts.Identifier,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		// For computed/functions, we need to use template position since
		// the actual class values are in dynamic expressions
		const templatePosition = identifier.getStart();
		const templateLength = identifier.text.length;

		// PRIORITY 1: Try to find the actual variable declaration via PropertySignature's typeof
		// This allows us to use original positions for string literals in the script section
		const symbol = typeChecker.getSymbolAtLocation(identifier);
		if (symbol) {
			const declarations = symbol.getDeclarations();
			if (declarations) {
				for (const decl of declarations) {
					if (typescript.isPropertySignature(decl) && decl.type) {
						// Check if the type is a TypeQuery (typeof expression)
						if (typescript.isTypeQueryNode(decl.type)) {
							// The exprName contains the identifier we need to resolve
							const exprName = decl.type.exprName;
							if (typescript.isIdentifier(exprName)) {
								// Get the symbol for this identifier
								const varSymbol = typeChecker.getSymbolAtLocation(exprName);
								if (varSymbol) {
									const varDeclarations = varSymbol.getDeclarations();
									if (varDeclarations) {
										for (const varDecl of varDeclarations) {
											if (typescript.isVariableDeclaration(varDecl) && varDecl.initializer) {
												// Check if it's a computed() call - use ORIGINAL position
												// so errors point to actual class strings in script
												if (typescript.isCallExpression(varDecl.initializer)) {
													const computedClasses = this.extractFromComputedCall(
														varDecl.initializer,
														context,
														attributeId
														// Don't pass templatePosition - use original positions
													);
													if (computedClasses.length > 0) {
														return computedClasses;
													}
												}
												// For string literals, use ORIGINAL position from script
												// This makes errors point to the actual invalid class
												const classes = this.extractFromExpression(varDecl.initializer, context);
												if (classes.length > 0) {
													return classes.map(c => ({ ...c, attributeId }));
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		// PRIORITY 2: Fall back to type-based extraction with template position
		// This handles cases where we can't find the actual declaration
		const type = typeChecker.getTypeAtLocation(identifier);

		// Check if it's a string literal type (simple string variable)
		if (type.isStringLiteral()) {
			const classValue = type.value;
			return this.parseClassString(classValue, identifier, context, attributeId);
		}

		// For union types (e.g., ternary expressions), collect all string literal types
		if (type.isUnion()) {
			const classNames: ClassNameInfo[] = [];
			for (const unionType of type.types) {
				if (unionType.isStringLiteral()) {
					classNames.push(
						...this.parseClassString(unionType.value, identifier, context, attributeId)
					);
				}
			}
			if (classNames.length > 0) {
				return classNames;
			}
		}

		// PRIORITY 3: Fallback via type.getSymbol() for non-PropertySignature cases
		const typeSymbol = type.getSymbol();
		if (typeSymbol) {
			const declarations = typeSymbol.getDeclarations();
			if (declarations) {
				for (const decl of declarations) {
					if (typescript.isVariableDeclaration(decl) && decl.initializer) {
						// Check if it's a computed() call
						if (typescript.isCallExpression(decl.initializer)) {
							const computedClasses = this.extractFromComputedCall(
								decl.initializer,
								context,
								attributeId,
								templatePosition,
								templateLength
							);
							if (computedClasses.length > 0) {
								return computedClasses;
							}
						}
						// Otherwise extract from the initializer directly
						const classes = this.extractFromExpression(decl.initializer, context);
						return classes.map(c => ({
							...c,
							attributeId,
							absoluteStart: templatePosition,
							length: templateLength,
							line: context.sourceFile.getLineAndCharacterOfPosition(templatePosition).line + 1
						}));
					}
				}
			}
		}

		return [];
	}

	/**
	 * Parse a class string into ClassNameInfo array.
	 * Uses the identifier position for diagnostics (mapped by Volar).
	 */
	private parseClassString(
		classValue: string,
		identifier: ts.Identifier,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		if (!classValue || classValue.length === 0) {
			return classNames;
		}

		// Use identifier position for all diagnostics (Volar will map this)
		const position = identifier.getStart();
		const line = context.sourceFile.getLineAndCharacterOfPosition(position).line + 1;

		const parts = classValue.split(/\s+/);
		for (const part of parts) {
			if (part && part.trim()) {
				classNames.push({
					className: part.trim(),
					absoluteStart: position,
					length: identifier.text.length,
					line,
					file: context.sourceFile.fileName,
					attributeId
				});
			}
		}

		return classNames;
	}

	/**
	 * Extract classes from a __VLS_ctx.functionName() call by resolving the function.
	 */
	private extractFromVlsCtxFunctionCall(
		functionName: ts.Identifier,
		context: ExtractionContext,
		attributeId: string,
		templatePosition: number,
		templateLength: number
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		// Get the symbol for the function name
		const symbol = typeChecker.getSymbolAtLocation(functionName);
		if (!symbol) {
			return [];
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		for (const declaration of declarations) {
			// Handle property assignment in Vue's return: `return { getClasses: getClasses as typeof getClasses }`
			if (typescript.isPropertyAssignment(declaration)) {
				const initializer = declaration.initializer;
				// Unwrap type assertion: `getClasses as typeof getClasses` -> `getClasses`
				let expr = initializer;
				if (typescript.isAsExpression(expr)) {
					expr = expr.expression;
				}
				// Resolve the identifier to the actual function
				if (typescript.isIdentifier(expr)) {
					const funcClasses = this.resolveFunctionIdentifier(
						expr,
						context,
						attributeId,
						templatePosition,
						templateLength
					);
					classNames.push(...funcClasses);
				}
			}
			// Handle shorthand property: `return { getClasses }`
			else if (typescript.isShorthandPropertyAssignment(declaration)) {
				const funcClasses = this.resolveFunctionIdentifier(
					declaration.name,
					context,
					attributeId,
					templatePosition,
					templateLength
				);
				classNames.push(...funcClasses);
			}
			// Handle property signature in Volar 3.x:
			// type __VLS_SetupExposed = { getClasses: typeof getClasses; }
			else if (typescript.isPropertySignature(declaration)) {
				// The type is `typeof getClasses`, which refers to the actual function
				// We need to get the type and find the function declaration
				const funcClasses = this.extractFromPropertySignatureFunction(
					functionName,
					context,
					attributeId
				);
				classNames.push(...funcClasses);
			}
		}

		return classNames;
	}

	/**
	 * Extract classes from a function referenced via PropertySignature.
	 * In Volar 3.x: `type __VLS_SetupExposed = { getClasses: typeof getClasses; }`
	 */
	private extractFromPropertySignatureFunction(
		functionName: ts.Identifier,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		// Get the type at the function name location
		const type = typeChecker.getTypeAtLocation(functionName);

		// Try to find the actual function via type's symbol FIRST
		// This gives us access to the function body for analysis
		const typeSymbol = type.getSymbol();
		if (typeSymbol) {
			const funcDeclarations = typeSymbol.getDeclarations();
			if (funcDeclarations) {
				for (const decl of funcDeclarations) {
					if (typescript.isFunctionDeclaration(decl) && decl.body) {
						// Don't pass templatePosition - use original positions
						// so errors point to actual class strings in script
						return this.extractFromFunctionBody(decl.body, context, attributeId);
					}
				}
			}
		}

		// Fallback: try to extract from return type if it's a tuple of literals
		const callSignatures = type.getCallSignatures();
		if (callSignatures.length === 0) {
			return [];
		}

		const returnType = callSignatures[0].getReturnType();

		// For array types like string[], check if elements are string literal types
		if (typeChecker.isArrayType(returnType)) {
			const typeArgs = (returnType as ts.TypeReference).typeArguments;
			if (typeArgs && typeArgs.length > 0) {
				const elementType = typeArgs[0];
				return this.extractClassesFromType(elementType, functionName, context, attributeId);
			}
		}

		return [];
	}

	/**
	 * Extract classes from a TypeScript type (for union types, string literals, etc.)
	 */
	private extractClassesFromType(
		type: ts.Type,
		identifier: ts.Identifier,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		// For union types, collect all string literal types
		if (type.isUnion()) {
			for (const unionType of type.types) {
				if (unionType.isStringLiteral()) {
					classNames.push(
						...this.parseClassString(unionType.value, identifier, context, attributeId)
					);
				}
			}
		}
		// For single string literal type
		else if (type.isStringLiteral()) {
			classNames.push(...this.parseClassString(type.value, identifier, context, attributeId));
		}

		return classNames;
	}

	/**
	 * Resolve a function identifier to its declaration and extract classes from return statements.
	 */
	private resolveFunctionIdentifier(
		identifier: ts.Identifier,
		context: ExtractionContext,
		attributeId: string,
		templatePosition: number,
		templateLength: number
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		const symbol = typeChecker.getSymbolAtLocation(identifier);
		if (!symbol) {
			return [];
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];

		for (const declaration of declarations) {
			if (typescript.isFunctionDeclaration(declaration)) {
				classNames.push(
					...this.extractFromFunctionDeclaration(
						declaration,
						context,
						attributeId,
						templatePosition,
						templateLength
					)
				);
			}
		}

		return classNames;
	}

	/**
	 * Resolve classes from a property assignment initializer.
	 * Handles patterns like `myClass as typeof myClass` or just `myClass`.
	 */
	private resolvePropertyAssignmentClasses(
		initializer: ts.Expression,
		context: ExtractionContext,
		attributeId: string,
		templatePosition: number,
		templateLength: number
	): ClassNameInfo[] {
		const { typescript } = context;

		// Unwrap type assertions: `myClass as typeof myClass` -> `myClass`
		let expr = initializer;
		if (typescript.isAsExpression(expr)) {
			expr = expr.expression;
		}

		// If it's an identifier, resolve it to the actual variable
		if (typescript.isIdentifier(expr)) {
			return this.resolveIdentifierClasses(
				expr,
				context,
				attributeId,
				templatePosition,
				templateLength
			);
		}

		return [];
	}

	/**
	 * Resolve classes from an identifier by finding its declaration.
	 */
	private resolveIdentifierClasses(
		identifier: ts.Identifier,
		context: ExtractionContext,
		attributeId: string,
		templatePosition: number,
		templateLength: number
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		const symbol = typeChecker.getSymbolAtLocation(identifier);
		if (!symbol) {
			return [];
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		const classNames: ClassNameInfo[] = [];
		// Keep original positions - diagnostic will point to where class is defined
		const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
			classes.map(c => ({
				...c,
				attributeId
			}));

		for (const declaration of declarations) {
			if (typescript.isVariableDeclaration(declaration)) {
				const init = declaration.initializer;
				if (init) {
					// Check for computed() calls
					if (typescript.isCallExpression(init)) {
						const computedClasses = this.extractFromComputedCall(
							init,
							context,
							attributeId,
							templatePosition,
							templateLength
						);
						if (computedClasses.length > 0) {
							classNames.push(...computedClasses);
							continue;
						}
					}
					// Extract classes from the initializer - keep original position
					classNames.push(...addAttributeId(this.extractFromExpression(init, context)));
				}
			} else if (typescript.isFunctionDeclaration(declaration)) {
				classNames.push(
					...this.extractFromFunctionDeclaration(
						declaration,
						context,
						attributeId,
						templatePosition,
						templateLength
					)
				);
			}
		}

		return classNames;
	}

	/**
	 * Extract classes from a computed() call expression.
	 * Handles: const classes = computed(() => ['flex', 'items-center'])
	 */
	private extractFromComputedCall(
		callExpr: ts.CallExpression,
		context: ExtractionContext,
		attributeId: string,
		templatePosition?: number,
		templateLength?: number
	): ClassNameInfo[] {
		const { typescript } = context;

		// Check if this is a call to 'computed'
		const calleeExpr = callExpr.expression;
		if (!typescript.isIdentifier(calleeExpr) || calleeExpr.text !== 'computed') {
			return [];
		}

		// Get the callback argument
		if (callExpr.arguments.length === 0) {
			return [];
		}

		const callback = callExpr.arguments[0];

		// Handle arrow functions: computed(() => [...])
		if (typescript.isArrowFunction(callback)) {
			return this.extractFromFunctionBody(
				callback.body,
				context,
				attributeId,
				templatePosition,
				templateLength
			);
		}

		// Handle regular functions: computed(function() { return [...] })
		if (typescript.isFunctionExpression(callback)) {
			if (callback.body) {
				return this.extractFromFunctionBody(
					callback.body,
					context,
					attributeId,
					templatePosition,
					templateLength
				);
			}
		}

		return [];
	}

	/**
	 * Extract classes from a function declaration's return statements.
	 * Handles: function getClasses() { return ['flex', 'items-center']; }
	 */
	private extractFromFunctionDeclaration(
		funcDecl: ts.FunctionDeclaration,
		context: ExtractionContext,
		attributeId: string,
		templatePosition?: number,
		templateLength?: number
	): ClassNameInfo[] {
		if (!funcDecl.body) {
			return [];
		}

		return this.extractFromFunctionBody(
			funcDecl.body,
			context,
			attributeId,
			templatePosition,
			templateLength
		);
	}

	/**
	 * Extract classes from a function body (block or expression).
	 * Handles both arrow function expressions and function blocks.
	 */
	private extractFromFunctionBody(
		body: ts.ConciseBody,
		context: ExtractionContext,
		attributeId: string,
		templatePosition?: number,
		templateLength?: number
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		// If template position is provided, override positions for Volar mapping
		const processClasses = (classes: ClassNameInfo[]): ClassNameInfo[] => {
			if (templatePosition !== undefined && templateLength !== undefined) {
				return classes.map(c => ({
					...c,
					attributeId,
					absoluteStart: templatePosition,
					length: templateLength,
					line: context.sourceFile.getLineAndCharacterOfPosition(templatePosition).line + 1
				}));
			}
			return classes.map(c => ({ ...c, attributeId }));
		};

		// Handle concise arrow function: () => ['flex', 'items-center']
		if (!typescript.isBlock(body)) {
			// The body is an expression, extract classes from it
			classNames.push(...processClasses(this.extractFromExpression(body, context)));
			return classNames;
		}

		// Handle block body: look for return statements
		const visitNode = (node: ts.Node) => {
			if (typescript.isReturnStatement(node) && node.expression) {
				classNames.push(...processClasses(this.extractFromExpression(node.expression, context)));
			}
			typescript.forEachChild(node, visitNode);
		};

		typescript.forEachChild(body, visitNode);
		return classNames;
	}

	/**
	 * Extract classes from an expression (array, object, string, etc.)
	 */
	private extractFromExpression(expr: ts.Expression, context: ExtractionContext): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		// String literal: 'flex items-center'
		if (typescript.isStringLiteral(expr)) {
			const fullText = expr.text;
			if (fullText.length === 0) {
				return classNames;
			}

			const stringContentStart = expr.getStart() + 1;
			let offset = 0;

			const parts = fullText.split(/(\s+)/);
			for (const part of parts) {
				if (part && !/^\s+$/.test(part)) {
					classNames.push({
						className: part,
						absoluteStart: stringContentStart + offset,
						length: part.length,
						line:
							context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line +
							1,
						file: context.sourceFile.fileName
					});
				}
				offset += part.length;
			}
			return classNames;
		}

		// Array literal: ['flex', 'items-center', { 'bg-red-500': isActive }]
		if (typescript.isArrayLiteralExpression(expr)) {
			for (const element of expr.elements) {
				if (element === undefined) continue;

				if (typescript.isStringLiteral(element)) {
					classNames.push(...this.extractFromExpression(element, context));
				} else if (typescript.isObjectLiteralExpression(element)) {
					classNames.push(...this.extractFromExpression(element, context));
				} else if (typescript.isSpreadElement(element)) {
					classNames.push(...this.extractFromExpression(element.expression, context));
				}
			}
			return classNames;
		}

		// Object literal: { 'flex': true, 'bg-red-500': isActive }
		if (typescript.isObjectLiteralExpression(expr)) {
			for (const prop of expr.properties) {
				if (typescript.isPropertyAssignment(prop)) {
					const propName = prop.name;
					let className: string | undefined;
					let start: number | undefined;

					if (typescript.isStringLiteral(propName)) {
						className = propName.text;
						start = propName.getStart() + 1;
					} else if (typescript.isIdentifier(propName)) {
						className = propName.text;
						start = propName.getStart();
					}

					if (className && start !== undefined) {
						classNames.push({
							className,
							absoluteStart: start,
							length: className.length,
							line: context.sourceFile.getLineAndCharacterOfPosition(start).line + 1,
							file: context.sourceFile.fileName
						});
					}
				} else if (typescript.isShorthandPropertyAssignment(prop)) {
					const className = prop.name.text;
					const start = prop.name.getStart();
					classNames.push({
						className,
						absoluteStart: start,
						length: className.length,
						line: context.sourceFile.getLineAndCharacterOfPosition(start).line + 1,
						file: context.sourceFile.fileName
					});
				}
			}
			return classNames;
		}

		return classNames;
	}
}
