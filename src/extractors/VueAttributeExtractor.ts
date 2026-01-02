import * as ts from 'typescript/lib/tsserverlibrary';

import { NodeFilterFn } from '../core/interfaces';
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
	 * Fast filter: Vue patterns are always CallExpression nodes (~95% node skip rate)
	 * Volar transforms templates into: __VLS_asFunctionalElement(...)({...})
	 */
	getNodeFilter(): NodeFilterFn {
		return (node, typescript) => typescript.isCallExpression(node);
	}

	/**
	 * Override to handle Vue's __VLS_ctx pattern.
	 *
	 * Vue generates code like __VLS_ctx.clsx(...) for template expressions
	 * where clsx is imported in the script section. We need to check if the
	 * function name (not __VLS_ctx) is directly imported.
	 *
	 * Also handles namespace imports: __VLS_ctx.utils.clsx(...) for `import * as utils from 'clsx'`
	 */
	protected override shouldValidateFunctionCall(
		callExpression: ts.CallExpression,
		utilityFunctions: UtilityFunction[],
		context?: ExtractionContext
	): boolean {
		// First, check if this is a __VLS_ctx.functionName() or __VLS_ctx.namespace.functionName() pattern
		if (context) {
			const expr = callExpression.expression;
			if (context.typescript.isPropertyAccessExpression(expr)) {
				const objectExpr = expr.expression;

				// Pattern 1: __VLS_ctx.functionName() - direct import
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

				// Pattern 2: __VLS_ctx.namespace.functionName() - namespace import
				// e.g., import * as utils from 'clsx' -> __VLS_ctx.utils.clsx()
				if (context.typescript.isPropertyAccessExpression(objectExpr)) {
					const namespaceRoot = objectExpr.expression;
					if (
						context.typescript.isIdentifier(namespaceRoot) &&
						namespaceRoot.text === '__VLS_ctx'
					) {
						const namespaceName = objectExpr.name.text; // e.g., 'utils'
						const functionName = expr.name.text; // e.g., 'clsx'

						// Check each utility function configuration
						for (const utilityFunc of utilityFunctions) {
							if (typeof utilityFunc === 'string') {
								if (utilityFunc === functionName) {
									return true;
								}
							} else if (utilityFunc.name === functionName) {
								// Check if namespace is imported from expected module
								if (this.isNamespaceImportedFrom(namespaceName, utilityFunc.from, context)) {
									return true;
								}
							}
						}
						return false;
					}
				}
			}
		}

		// Fall back to base implementation for non-Vue patterns
		return super.shouldValidateFunctionCall(callExpression, utilityFunctions, context);
	}

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		// We handle call expressions that look like Vue's generated element calls
		// Pattern 1 (intrinsic elements): __VLS_asFunctionalElement(...)({ ...{ class: ... } })
		// Pattern 2 (custom components): __VLS_1({ colorStyles: ... }, ...)
		if (!context.typescript.isCallExpression(node)) {
			return false;
		}

		// Check if the arguments contain an object with class properties
		if (node.arguments.length === 0) {
			return false;
		}

		const firstArg = node.arguments[0];
		if (!context.typescript.isObjectLiteralExpression(firstArg)) {
			return false;
		}

		const expression = node.expression;

		// Pattern 1: Chained call (intrinsic elements)
		// func(...)({...}) where the result of func(...) is called again
		if (context.typescript.isCallExpression(expression)) {
			// Look for spread assignments with class property
			return this.hasClassSpreadProperty(firstArg, context);
		}

		// Pattern 2: Identifier call (custom components)
		// __VLS_N({ classAttribute: ... }, ...)
		if (context.typescript.isIdentifier(expression)) {
			const name = expression.text;
			// Vue generates __VLS_0, __VLS_1, etc. for component instances
			if (name.startsWith('__VLS_')) {
				// Check for direct class attribute properties
				return this.hasClassDirectProperty(firstArg, context);
			}
		}

		return false;
	}

	private hasClassSpreadProperty(
		obj: ts.ObjectLiteralExpression,
		context: ExtractionContext
	): boolean {
		// Build set of class attribute names to check
		const classAttributeNames = new Set(['class', ...(context.classAttributes || [])]);

		for (const prop of obj.properties) {
			if (context.typescript.isSpreadAssignment(prop)) {
				const spreadExpr = prop.expression;
				if (context.typescript.isObjectLiteralExpression(spreadExpr)) {
					for (const innerProp of spreadExpr.properties) {
						if (context.typescript.isPropertyAssignment(innerProp)) {
							const name = innerProp.name;
							if (context.typescript.isIdentifier(name) && classAttributeNames.has(name.text)) {
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Check if an object has direct class attribute properties (for custom components).
	 * Vue generates direct properties like: { colorStyles: "bg-blue-500" }
	 */
	private hasClassDirectProperty(
		obj: ts.ObjectLiteralExpression,
		context: ExtractionContext
	): boolean {
		const classAttributeNames = new Set(['class', ...(context.classAttributes || [])]);

		for (const prop of obj.properties) {
			if (context.typescript.isPropertyAssignment(prop)) {
				const name = prop.name;
				if (context.typescript.isIdentifier(name) && classAttributeNames.has(name.text)) {
					return true;
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

		// Build set of class attribute names to check
		const classAttributeNames = new Set(['class', ...(context.classAttributes || [])]);

		// Process all properties in the object literal
		for (const prop of firstArg.properties) {
			// Handle spread assignments: ...{ class: "..." }
			if (context.typescript.isSpreadAssignment(prop)) {
				const spreadExpr = prop.expression;
				if (context.typescript.isObjectLiteralExpression(spreadExpr)) {
					for (const innerProp of spreadExpr.properties) {
						if (!context.typescript.isPropertyAssignment(innerProp)) {
							continue;
						}

						const name = innerProp.name;
						if (!context.typescript.isIdentifier(name)) {
							continue;
						}

						// Check if this is a class attribute
						if (!classAttributeNames.has(name.text)) {
							continue;
						}

						const value = innerProp.initializer;
						const attributeId = `${innerProp.getStart()}-${innerProp.getEnd()}`;
						classNames.push(...this.extractClassesFromValue(value, context, attributeId));
					}
				}
			}
			// Handle direct property assignments: colorStyles: "..."
			else if (context.typescript.isPropertyAssignment(prop)) {
				const name = prop.name;
				if (!context.typescript.isIdentifier(name)) {
					continue;
				}

				// Check if this is a class attribute (custom attributes like colorStyles)
				if (!classAttributeNames.has(name.text)) {
					continue;
				}

				const value = prop.initializer;
				const attributeId = `${prop.getStart()}-${prop.getEnd()}`;
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
			// Use extractFromObjectExpression which handles computed property names
			return this.extractFromObjectExpression(objectExpr, context, attributeId);
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
			// Process array elements directly to handle __VLS_ctx references
			return this.extractFromArrayExpression(arrayExpr, context, attributeId);
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

		if (callExpr) {
			// Check if it's a utility function (clsx, cn, etc.) - extract all arguments
			if (this.shouldValidateFunctionCall(callExpr, context.utilityFunctions, context)) {
				const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
					classes.map(c => ({ ...c, attributeId }));
				return addAttributeId(this.expressionExtractor.extract(callExpr, context));
			}

			// Check for CVA/TV function calls with class override: button({ class: '...' })
			// These are __VLS_ctx.functionName({ class: '...' }) patterns
			const classOverrideClasses = this.extractFromCvaTvClassOverride(
				callExpr,
				context,
				attributeId
			);
			if (classOverrideClasses.length > 0) {
				return classOverrideClasses;
			}
		}

		// Handle conditional (ternary) expressions: class: (isActive ? 'flex' : 'hidden')
		// Vue wraps expressions in parentheses: class: (__VLS_ctx.isActive ? 'active' : 'inactive')
		let conditionalExpr: ts.ConditionalExpression | undefined;
		if (context.typescript.isConditionalExpression(value)) {
			conditionalExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (context.typescript.isConditionalExpression(inner)) {
				conditionalExpr = inner;
			}
		}

		if (conditionalExpr) {
			return this.extractFromConditionalExpression(conditionalExpr, context, attributeId);
		}

		// Handle binary expressions: class: (isActive && 'flex')
		// Vue wraps expressions in parentheses: class: (__VLS_ctx.isActive && 'active')
		let binaryExpr: ts.BinaryExpression | undefined;
		if (context.typescript.isBinaryExpression(value)) {
			binaryExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			const inner = value.expression;
			if (context.typescript.isBinaryExpression(inner)) {
				binaryExpr = inner;
			}
		}

		if (binaryExpr) {
			return this.extractFromBinaryExpression(binaryExpr, context, attributeId);
		}

		// Handle type assertions: class: ('invalid-class' as string)
		// Vue wraps expressions: class: (('invalid-class' as string))
		let asExpr: ts.AsExpression | undefined;
		if (context.typescript.isAsExpression(value)) {
			asExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			let inner = value.expression;
			// Double unwrap for nested parentheses
			if (context.typescript.isParenthesizedExpression(inner)) {
				inner = inner.expression;
			}
			if (context.typescript.isAsExpression(inner)) {
				asExpr = inner;
			}
		}

		if (asExpr) {
			return this.extractClassesFromValue(asExpr.expression, context, attributeId);
		}

		// Handle non-null assertions: class: (someClass!)
		let nonNullExpr: ts.NonNullExpression | undefined;
		if (context.typescript.isNonNullExpression(value)) {
			nonNullExpr = value;
		} else if (context.typescript.isParenthesizedExpression(value)) {
			let inner = value.expression;
			if (context.typescript.isParenthesizedExpression(inner)) {
				inner = inner.expression;
			}
			if (context.typescript.isNonNullExpression(inner)) {
				nonNullExpr = inner;
			}
		}

		if (nonNullExpr) {
			return this.extractClassesFromValue(nonNullExpr.expression, context, attributeId);
		}

		// Handle __VLS_ctx.propertyName patterns for variable/computed/function references
		// Vue generates: class: (__VLS_ctx.myClass) for :class="myClass"
		const resolvedClasses = this.extractFromVlsCtxReference(value, context, attributeId);
		if (resolvedClasses.length > 0) {
			return resolvedClasses;
		}

		// Handle props.propertyName patterns with default values from withDefaults
		// Vue generates: class: (props.buttonClass) for :class="props.buttonClass"
		const propsDefaultClasses = this.extractFromPropsWithDefaults(value, context, attributeId);
		if (propsDefaultClasses.length > 0) {
			return propsDefaultClasses;
		}

		return classNames;
	}

	/**
	 * Extract classes from an array expression, handling __VLS_ctx references.
	 * This method processes array elements directly to support variable references.
	 */
	private extractFromArrayExpression(
		arrayExpr: ts.ArrayLiteralExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		for (const element of arrayExpr.elements) {
			if (element === undefined) continue;

			// String literal: 'flex'
			if (typescript.isStringLiteral(element)) {
				const fullText = element.text;
				if (fullText.length > 0) {
					const stringContentStart = element.getStart() + 1;
					let offset = 0;
					const parts = fullText.split(/(\s+)/);
					for (const part of parts) {
						if (part && !/^\s+$/.test(part)) {
							classNames.push({
								className: part,
								absoluteStart: stringContentStart + offset,
								length: part.length,
								line:
									context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset)
										.line + 1,
								file: context.sourceFile.fileName,
								attributeId
							});
						}
						offset += part.length;
					}
				}
			}
			// Object literal: { 'bg-red-500': isActive }
			else if (typescript.isObjectLiteralExpression(element)) {
				classNames.push(...this.extractFromObjectExpression(element, context, attributeId));
			}
			// Spread element: ...classes
			else if (typescript.isSpreadElement(element)) {
				// Try to resolve __VLS_ctx reference
				const vlsResults = this.extractFromVlsCtxReference(
					element.expression,
					context,
					attributeId
				);
				if (vlsResults.length > 0) {
					classNames.push(...vlsResults);
				}
			}
			// Handle __VLS_ctx.variable references: __VLS_ctx.myClass
			else if (typescript.isPropertyAccessExpression(element)) {
				const vlsResults = this.extractFromVlsCtxReference(element, context, attributeId);
				if (vlsResults.length > 0) {
					classNames.push(...vlsResults);
				}
			}
			// Handle parenthesized expressions: (__VLS_ctx.myVar)
			else if (typescript.isParenthesizedExpression(element)) {
				const inner = element.expression;
				if (typescript.isPropertyAccessExpression(inner)) {
					const vlsResults = this.extractFromVlsCtxReference(inner, context, attributeId);
					if (vlsResults.length > 0) {
						classNames.push(...vlsResults);
					}
				} else if (typescript.isArrayLiteralExpression(inner)) {
					// Nested array in parentheses
					classNames.push(...this.extractFromArrayExpression(inner, context, attributeId));
				}
			}
			// Handle nested arrays recursively
			else if (typescript.isArrayLiteralExpression(element)) {
				classNames.push(...this.extractFromArrayExpression(element, context, attributeId));
			}
			// Handle ternary/conditional expressions
			else if (typescript.isConditionalExpression(element)) {
				// Extract from both branches
				classNames.push(...this.extractFromConditionalElement(element, context, attributeId));
			}
		}

		return classNames;
	}

	/**
	 * Extract classes from an object expression, handling computed property names.
	 */
	private extractFromObjectExpression(
		objExpr: ts.ObjectLiteralExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		for (const prop of objExpr.properties) {
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
				// Handle computed property names: { [__VLS_ctx.myVar]: true }
				else if (typescript.isComputedPropertyName(propName)) {
					let computedExpr = propName.expression;
					// Unwrap parentheses
					if (typescript.isParenthesizedExpression(computedExpr)) {
						computedExpr = computedExpr.expression;
					}
					// Resolve __VLS_ctx.variable pattern
					if (typescript.isPropertyAccessExpression(computedExpr)) {
						const vlsResults = this.extractFromVlsCtxReference(computedExpr, context, attributeId);
						if (vlsResults.length > 0) {
							classNames.push(...vlsResults);
							continue;
						}
					}
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
			} else if (typescript.isShorthandPropertyAssignment(prop)) {
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

	/**
	 * Extract classes from a conditional (ternary) expression in array context.
	 */
	private extractFromConditionalElement(
		conditional: ts.ConditionalExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		return this.extractFromConditionalExpression(conditional, context, attributeId);
	}

	/**
	 * Extract classes from a conditional (ternary) expression.
	 * Handles: isActive ? 'flex' : 'hidden'
	 */
	private extractFromConditionalExpression(
		conditional: ts.ConditionalExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Use the ternary's position as a unique identifier (like ExpressionExtractor)
		const ternaryId = conditional.getStart();

		// Extract from true branch with conditionalBranchId
		const whenTrue = conditional.whenTrue;
		classNames.push(
			...this.extractFromBranchExpression(
				whenTrue,
				context,
				attributeId,
				`ternary:true:${ternaryId}`
			)
		);

		// Extract from false branch with conditionalBranchId
		const whenFalse = conditional.whenFalse;
		classNames.push(
			...this.extractFromBranchExpression(
				whenFalse,
				context,
				attributeId,
				`ternary:false:${ternaryId}`
			)
		);

		return classNames;
	}

	/**
	 * Extract classes from a binary expression.
	 * Handles: isActive && 'flex', isDisabled || 'fallback'
	 */
	private extractFromBinaryExpression(
		binary: ts.BinaryExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Extract from left operand (for patterns like: 'flex' || fallback)
		classNames.push(...this.extractFromBranchExpression(binary.left, context, attributeId));

		// Extract from right operand (for patterns like: isActive && 'flex')
		classNames.push(...this.extractFromBranchExpression(binary.right, context, attributeId));

		return classNames;
	}

	/**
	 * Extract classes from a branch expression (ternary branch or binary operand).
	 * Handles string literals, nested ternaries, nested binaries, and VLS references.
	 */
	private extractFromBranchExpression(
		expr: ts.Expression,
		context: ExtractionContext,
		attributeId: string,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		// Helper to add conditionalBranchId to extracted classes
		const addBranchId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
			conditionalBranchId ? classes.map(c => ({ ...c, conditionalBranchId })) : classes;

		// String literal: 'flex items-center'
		if (typescript.isStringLiteral(expr)) {
			classNames.push(
				...addBranchId(this.extractClassesFromStringLiteral(expr, context, attributeId))
			);
		}
		// Nested ternary: condition ? 'a' : (nested ? 'b' : 'c')
		else if (typescript.isConditionalExpression(expr)) {
			classNames.push(...this.extractFromConditionalExpression(expr, context, attributeId));
		}
		// Nested binary: isA && isB && 'class'
		else if (typescript.isBinaryExpression(expr)) {
			classNames.push(...addBranchId(this.extractFromBinaryExpression(expr, context, attributeId)));
		}
		// Parenthesized expression
		else if (typescript.isParenthesizedExpression(expr)) {
			classNames.push(
				...this.extractFromBranchExpression(
					expr.expression,
					context,
					attributeId,
					conditionalBranchId
				)
			);
		}
		// VLS ctx reference: __VLS_ctx.myClass
		else if (typescript.isPropertyAccessExpression(expr)) {
			const vlsResults = this.extractFromVlsCtxReference(expr, context, attributeId);
			classNames.push(...addBranchId(vlsResults));
		}
		// Template literal: `flex ${something}`
		else if (
			typescript.isTemplateExpression(expr) ||
			typescript.isNoSubstitutionTemplateLiteral(expr)
		) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			classNames.push(
				...addBranchId(addAttributeId(this.expressionExtractor.extract(expr, context)))
			);
		}

		return classNames;
	}

	/**
	 * Extract classes from CVA/TV function calls with class override.
	 * Handles patterns like: button({ color: 'primary', class: 'invalid-class' })
	 *
	 * Only extracts from functions that are defined using cva() or tv(),
	 * not from arbitrary custom functions.
	 */
	private extractFromCvaTvClassOverride(
		callExpr: ts.CallExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		// Check if this is a __VLS_ctx.functionName pattern
		const calleeExpr = callExpr.expression;
		if (!typescript.isPropertyAccessExpression(calleeExpr)) {
			return classNames;
		}

		const objectExpr = calleeExpr.expression;
		if (!typescript.isIdentifier(objectExpr) || objectExpr.text !== '__VLS_ctx') {
			return classNames;
		}

		const functionName = calleeExpr.name;
		if (!typescript.isIdentifier(functionName)) {
			return classNames;
		}

		// Check if this function is defined using cva() or tv()
		// by looking at its definition
		if (!this.isCvaTvFunction(functionName, context)) {
			return classNames;
		}

		// Look for object argument with class/className property
		if (callExpr.arguments.length === 0) {
			return classNames;
		}

		const firstArg = callExpr.arguments[0];
		if (!typescript.isObjectLiteralExpression(firstArg)) {
			return classNames;
		}

		// Find class or className property
		for (const prop of firstArg.properties) {
			if (!typescript.isPropertyAssignment(prop)) {
				continue;
			}

			const propName = prop.name;
			if (!typescript.isIdentifier(propName)) {
				continue;
			}

			if (propName.text !== 'class' && propName.text !== 'className') {
				continue;
			}

			// Extract classes from the property value
			const value = prop.initializer;
			if (typescript.isStringLiteral(value)) {
				classNames.push(...this.extractClassesFromStringLiteral(value, context, attributeId));
			} else if (typescript.isArrayLiteralExpression(value)) {
				classNames.push(...this.extractFromArrayExpression(value, context, attributeId));
			} else if (
				typescript.isTemplateExpression(value) ||
				typescript.isNoSubstitutionTemplateLiteral(value)
			) {
				const addAttrId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
					classes.map(c => ({ ...c, attributeId }));
				classNames.push(...addAttrId(this.expressionExtractor.extract(value, context)));
			}
		}

		return classNames;
	}

	/**
	 * Check if a function is defined using cva() or tv().
	 * Resolves the function symbol and checks if its initializer is a cva/tv call.
	 */
	private isCvaTvFunction(functionName: ts.Identifier, context: ExtractionContext): boolean {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return false;
		}

		// Get the symbol for the function name
		const symbol = typeChecker.getSymbolAtLocation(functionName);
		if (!symbol) {
			return false;
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return false;
		}

		for (const declaration of declarations) {
			// Check PropertySignature -> typeof reference in Volar 3.x
			if (typescript.isPropertySignature(declaration) && declaration.type) {
				if (typescript.isTypeQueryNode(declaration.type)) {
					const exprName = declaration.type.exprName;
					if (typescript.isIdentifier(exprName)) {
						// Resolve the actual variable
						const varSymbol = typeChecker.getSymbolAtLocation(exprName);
						if (varSymbol) {
							const varDeclarations = varSymbol.getDeclarations();
							if (varDeclarations) {
								for (const varDecl of varDeclarations) {
									if (typescript.isVariableDeclaration(varDecl) && varDecl.initializer) {
										if (this.isCallToCvaOrTv(varDecl.initializer, context)) {
											return true;
										}
									}
								}
							}
						}
					}
				}
			}
			// Check direct variable declaration
			else if (typescript.isVariableDeclaration(declaration) && declaration.initializer) {
				if (this.isCallToCvaOrTv(declaration.initializer, context)) {
					return true;
				}
			}
			// Check property assignment in Vue's return
			else if (typescript.isPropertyAssignment(declaration)) {
				let expr = declaration.initializer;
				if (typescript.isAsExpression(expr)) {
					expr = expr.expression;
				}
				if (typescript.isIdentifier(expr)) {
					const refSymbol = typeChecker.getSymbolAtLocation(expr);
					if (refSymbol) {
						const refDeclarations = refSymbol.getDeclarations();
						if (refDeclarations) {
							for (const refDecl of refDeclarations) {
								if (typescript.isVariableDeclaration(refDecl) && refDecl.initializer) {
									if (this.isCallToCvaOrTv(refDecl.initializer, context)) {
										return true;
									}
								}
							}
						}
					}
				}
			}
		}

		return false;
	}

	/**
	 * Check if an expression is a call to cva() or tv().
	 */
	private isCallToCvaOrTv(expr: ts.Expression, context: ExtractionContext): boolean {
		const { typescript } = context;

		if (!typescript.isCallExpression(expr)) {
			return false;
		}

		const callee = expr.expression;

		// Direct call: cva(...) or tv(...)
		if (typescript.isIdentifier(callee)) {
			const name = callee.text;
			return name === 'cva' || name === 'tv' || name === 'tvLite';
		}

		return false;
	}

	/**
	 * Extract classes from a string literal with attributeId.
	 */
	private extractClassesFromStringLiteral(
		literal: ts.StringLiteral,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const fullText = literal.text;

		if (fullText.length === 0) {
			return classNames;
		}

		const stringContentStart = literal.getStart() + 1;
		let offset = 0;

		const parts = fullText.split(/(\s+)/);
		for (const part of parts) {
			if (part && !/^\s+$/.test(part)) {
				classNames.push({
					className: part,
					absoluteStart: stringContentStart + offset,
					length: part.length,
					line:
						context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line + 1,
					file: context.sourceFile.fileName,
					attributeId
				});
			}
			offset += part.length;
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

		// Handle nested property access: __VLS_ctx.obj.property
		// e.g., __VLS_ctx.slotProps.buttonClass
		if (typescript.isPropertyAccessExpression(objectExpr)) {
			const nestedObject = objectExpr.expression;
			if (typescript.isIdentifier(nestedObject) && nestedObject.text === '__VLS_ctx') {
				// This is __VLS_ctx.something.somethingElse
				const middlePropName = objectExpr.name;
				const finalPropName = expr.name;

				if (typescript.isIdentifier(middlePropName) && typescript.isIdentifier(finalPropName)) {
					// Resolve the middle property (e.g., slotProps) to get its type/value
					const middleSymbol = typeChecker.getSymbolAtLocation(middlePropName);
					if (middleSymbol) {
						const middleDeclarations = middleSymbol.getDeclarations();
						if (middleDeclarations) {
							for (const middleDecl of middleDeclarations) {
								// Handle variable declaration: const slotProps = { buttonClass: '...' }
								if (typescript.isVariableDeclaration(middleDecl) && middleDecl.initializer) {
									if (typescript.isObjectLiteralExpression(middleDecl.initializer)) {
										// Find the property in the object literal
										for (const prop of middleDecl.initializer.properties) {
											if (typescript.isPropertyAssignment(prop)) {
												const propName = prop.name;
												if (
													typescript.isIdentifier(propName) &&
													propName.text === finalPropName.text
												) {
													// Found the property, extract classes from its value
													// Keep original positions from the class string
													const classes = this.extractFromExpression(
														prop.initializer,
														context,
														attributeId
													);
													return classes.map(c => ({
														...c,
														attributeId
													}));
												}
											}
										}
									}
								}
								// Handle property signature in Volar's generated types
								else if (typescript.isPropertySignature(middleDecl) && middleDecl.type) {
									if (typescript.isTypeQueryNode(middleDecl.type)) {
										const exprName = middleDecl.type.exprName;
										if (typescript.isIdentifier(exprName)) {
											const varSymbol = typeChecker.getSymbolAtLocation(exprName);
											if (varSymbol) {
												const varDeclarations = varSymbol.getDeclarations();
												if (varDeclarations) {
													for (const varDecl of varDeclarations) {
														if (
															typescript.isVariableDeclaration(varDecl) &&
															varDecl.initializer &&
															typescript.isObjectLiteralExpression(varDecl.initializer)
														) {
															// Find the property
															for (const prop of varDecl.initializer.properties) {
																if (typescript.isPropertyAssignment(prop)) {
																	const pName = prop.name;
																	if (
																		typescript.isIdentifier(pName) &&
																		pName.text === finalPropName.text
																	) {
																		// Keep original positions from the class string
																		const classes = this.extractFromExpression(
																			prop.initializer,
																			context,
																			attributeId
																		);
																		return classes.map(c => ({
																			...c,
																			attributeId
																		}));
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
						}
					}
				}
			}
			return [];
		}

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
					// Check if this is a computed() or inject() call
					if (typescript.isCallExpression(initializer)) {
						// Handle computed() calls
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

						// Handle inject() calls with default value: inject('key', 'default-classes')
						const injectClasses = this.extractFromInjectCall(initializer, context, attributeId);
						if (injectClasses.length > 0) {
							classNames.push(...injectClasses);
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
												// Check if it's a computed() or inject() call - use ORIGINAL position
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

													// Check for inject() calls with default value
													const injectClasses = this.extractFromInjectCall(
														varDecl.initializer,
														context,
														attributeId
													);
													if (injectClasses.length > 0) {
														return injectClasses;
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
							// Check for inject() calls with default value
							const injectClasses = this.extractFromInjectCall(
								decl.initializer,
								context,
								attributeId
							);
							if (injectClasses.length > 0) {
								return injectClasses;
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
					// Check for computed() or inject() calls
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

						// Check for inject() calls with default value
						const injectClasses = this.extractFromInjectCall(init, context, attributeId);
						if (injectClasses.length > 0) {
							classNames.push(...injectClasses);
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
	 * Extract classes from an inject() call with a default value.
	 * Handles: const classes = inject('key', 'flex items-center')
	 */
	private extractFromInjectCall(
		callExpr: ts.CallExpression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript } = context;

		// Check if this is a call to 'inject'
		const calleeExpr = callExpr.expression;
		if (!typescript.isIdentifier(calleeExpr) || calleeExpr.text !== 'inject') {
			return [];
		}

		// inject() needs at least 2 arguments for us to extract the default value
		// inject(key, defaultValue) or inject(key, defaultValue, treatDefaultAsFactory)
		if (callExpr.arguments.length < 2) {
			return [];
		}

		const defaultValue = callExpr.arguments[1];

		// Extract classes from the default value
		const classes = this.extractFromExpression(defaultValue, context, attributeId);
		return classes.map(c => ({ ...c, attributeId }));
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
	 * @param expr The expression to extract from
	 * @param context The extraction context
	 * @param attributeId Optional attribute ID for tracking
	 */
	private extractFromExpression(
		expr: ts.Expression,
		context: ExtractionContext,
		attributeId?: string
	): ClassNameInfo[] {
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
					classNames.push(...this.extractFromExpression(element, context, attributeId));
				} else if (typescript.isObjectLiteralExpression(element)) {
					classNames.push(...this.extractFromExpression(element, context, attributeId));
				} else if (typescript.isSpreadElement(element)) {
					classNames.push(...this.extractFromExpression(element.expression, context, attributeId));
				}
				// Handle __VLS_ctx.variable references in arrays
				else if (typescript.isPropertyAccessExpression(element)) {
					if (attributeId) {
						const vlsResults = this.extractFromVlsCtxReference(element, context, attributeId);
						if (vlsResults.length > 0) {
							classNames.push(...vlsResults);
						}
					}
				}
				// Handle parenthesized expressions: (__VLS_ctx.myVar)
				else if (typescript.isParenthesizedExpression(element)) {
					const inner = element.expression;
					if (typescript.isPropertyAccessExpression(inner) && attributeId) {
						const vlsResults = this.extractFromVlsCtxReference(inner, context, attributeId);
						if (vlsResults.length > 0) {
							classNames.push(...vlsResults);
						}
					}
				}
				// Handle nested arrays recursively
				else if (typescript.isArrayLiteralExpression(element)) {
					classNames.push(...this.extractFromExpression(element, context, attributeId));
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
					// Handle computed property names: { [__VLS_ctx.myVar]: true }
					else if (typescript.isComputedPropertyName(propName)) {
						let computedExpr = propName.expression;
						// Unwrap parentheses: { [(__VLS_ctx.myVar)]: true }
						if (typescript.isParenthesizedExpression(computedExpr)) {
							computedExpr = computedExpr.expression;
						}
						// Resolve __VLS_ctx.variable pattern
						if (typescript.isPropertyAccessExpression(computedExpr) && attributeId) {
							const vlsResults = this.extractFromVlsCtxReference(
								computedExpr,
								context,
								attributeId
							);
							if (vlsResults.length > 0) {
								classNames.push(...vlsResults);
								continue;
							}
						}
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
				} else if (typescript.isShorthandPropertyAssignment(prop)) {
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

		// Handle conditional (ternary) expressions: isActive ? 'flex' : 'hidden'
		if (typescript.isConditionalExpression(expr)) {
			// Extract from both branches recursively
			classNames.push(...this.extractFromExpression(expr.whenTrue, context, attributeId));
			classNames.push(...this.extractFromExpression(expr.whenFalse, context, attributeId));
			return classNames;
		}

		// Handle binary expressions: isActive && 'flex', isDisabled || 'fallback'
		if (typescript.isBinaryExpression(expr)) {
			classNames.push(...this.extractFromExpression(expr.left, context, attributeId));
			classNames.push(...this.extractFromExpression(expr.right, context, attributeId));
			return classNames;
		}

		// Handle parenthesized expressions: ('flex items-center')
		if (typescript.isParenthesizedExpression(expr)) {
			return this.extractFromExpression(expr.expression, context, attributeId);
		}

		// Handle type assertions: 'flex' as string, 'flex' as const
		if (typescript.isAsExpression(expr)) {
			return this.extractFromExpression(expr.expression, context, attributeId);
		}

		// Handle non-null assertions: someValue!
		if (typescript.isNonNullExpression(expr)) {
			return this.extractFromExpression(expr.expression, context, attributeId);
		}

		// Handle template literals
		if (typescript.isTemplateExpression(expr) || typescript.isNoSubstitutionTemplateLiteral(expr)) {
			const addAttrId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				attributeId ? classes.map(c => ({ ...c, attributeId })) : classes;
			return addAttrId(this.expressionExtractor.extract(expr, context));
		}

		return classNames;
	}

	/**
	 * Extract classes from props.propertyName patterns with default values.
	 * Vue generates __VLS_defaults for withDefaults() calls.
	 *
	 * Generated code pattern:
	 * const __VLS_defaults = { buttonClass: 'flex items-center' };
	 * ...{ class: (props.buttonClass) }
	 */
	private extractFromPropsWithDefaults(
		value: ts.Expression,
		context: ExtractionContext,
		attributeId: string
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		// Unwrap parentheses: (props.buttonClass) -> props.buttonClass
		let expr = value;
		if (typescript.isParenthesizedExpression(expr)) {
			expr = expr.expression;
		}

		// Check for props.propertyName pattern
		if (!typescript.isPropertyAccessExpression(expr)) {
			return [];
		}

		const objectExpr = expr.expression;
		if (!typescript.isIdentifier(objectExpr) || objectExpr.text !== 'props') {
			return [];
		}

		const propertyName = expr.name;
		if (!typescript.isIdentifier(propertyName)) {
			return [];
		}

		// Look for __VLS_defaults in the source file
		const defaultsValue = this.findVlsDefaultsProperty(propertyName.text, context);

		if (defaultsValue) {
			return this.extractFromExpression(defaultsValue, context, attributeId);
		}

		return [];
	}

	/**
	 * Find a property value in __VLS_defaults object.
	 */
	private findVlsDefaultsProperty(
		propertyName: string,
		context: ExtractionContext
	): ts.Expression | undefined {
		const { typescript, sourceFile } = context;

		// Walk through the source file to find __VLS_defaults
		let result: ts.Expression | undefined;

		const visitor = (node: ts.Node): void => {
			if (result) return;

			if (typescript.isVariableDeclaration(node)) {
				const name = node.name;
				if (
					typescript.isIdentifier(name) &&
					name.text === '__VLS_defaults' &&
					node.initializer &&
					typescript.isObjectLiteralExpression(node.initializer)
				) {
					// Found __VLS_defaults, look for the property
					for (const prop of node.initializer.properties) {
						if (typescript.isPropertyAssignment(prop)) {
							const propName = prop.name;
							if (typescript.isIdentifier(propName) && propName.text === propertyName) {
								result = prop.initializer;
								return;
							}
						}
					}
				}
			}

			typescript.forEachChild(node, visitor);
		};

		typescript.forEachChild(sourceFile, visitor);
		return result;
	}
}
