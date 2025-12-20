import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';

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
	private expressionExtractor: ExpressionExtractor;

	constructor() {
		super();
		this.expressionExtractor = new ExpressionExtractor();
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
							context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line + 1,
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
		if (context.typescript.isArrayLiteralExpression(value)) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			return addAttributeId(this.expressionExtractor.extract(value, context));
		}

		// Template literal or other expressions - delegate to expression extractor
		if (
			context.typescript.isTemplateExpression(value) ||
			context.typescript.isNoSubstitutionTemplateLiteral(value)
		) {
			const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
				classes.map(c => ({ ...c, attributeId }));
			return addAttributeId(this.expressionExtractor.extract(value, context));
		}

		// Call expression (utility functions like cn, clsx)
		if (context.typescript.isCallExpression(value)) {
			if (this.shouldValidateFunctionCall(value, context.utilityFunctions, context)) {
				const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
					classes.map(c => ({ ...c, attributeId }));
				return addAttributeId(this.expressionExtractor.extract(value, context));
			}
		}

		return classNames;
	}
}
