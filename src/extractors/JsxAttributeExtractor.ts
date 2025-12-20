import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';
import { TemplateExpressionExtractor } from './TemplateExpressionExtractor';

/**
 * OPTIMIZED: Extracts class names from JSX className and class attributes
 * Supports both React (className) and Solid (class) syntaxes
 *
 * Performance improvements:
 * 1. Fast path for string literals (most common, ~70% of cases)
 * 2. Inline hot paths to reduce function call overhead
 * 3. Early returns to avoid unnecessary processing
 * 4. Reuse extractor instances
 */
export class JsxAttributeExtractor extends BaseExtractor {
	private expressionExtractor: ExpressionExtractor;
	private templateExtractor: TemplateExpressionExtractor;

	constructor() {
		super();
		// Create once, reuse (avoid recreation overhead)
		this.expressionExtractor = new ExpressionExtractor();
		this.templateExtractor = new TemplateExpressionExtractor();
	}

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return (
			context.typescript.isJsxOpeningElement(node) ||
			context.typescript.isJsxSelfClosingElement(node)
		);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Type guard (already checked in service, but keep for safety)
		if (
			!context.typescript.isJsxOpeningElement(node) &&
			!context.typescript.isJsxSelfClosingElement(node)
		) {
			return classNames;
		}

		const attributes = node.attributes.properties;

		// OPTIMIZATION: Early exit if no attributes
		if (attributes.length === 0) {
			return classNames;
		}

		// Get configured class attributes (defaults to ['className', 'class', 'classList'] if not provided)
		const classAttributes = context.classAttributes || ['className', 'class', 'classList'];

		// Process attributes
		for (const attr of attributes) {
			// OPTIMIZATION: Check if this is a JSX attribute and if it's a class attribute
			if (!context.typescript.isJsxAttribute(attr)) {
				continue;
			}

			const attrName = attr.name.getText();
			if (!classAttributes.includes(attrName)) {
				continue;
			}

			const initializer = attr.initializer;
			if (!initializer) {
				continue;
			}

			// Generate unique attributeId for duplicate detection
			const attributeId = `${attr.getStart()}-${attr.getEnd()}`;

			// FAST PATH: String literal (most common case ~70%)
			// Inline this hot path to avoid function call overhead
			if (context.typescript.isStringLiteral(initializer)) {
				const fullText = initializer.text;

				// OPTIMIZATION: Early exit for empty strings
				if (fullText.length === 0) {
					continue;
				}

				const stringContentStart = initializer.getStart() + 1;
				let offset = 0;

				// Split by whitespace (including newlines, tabs) while tracking position
				const parts = fullText.split(/(\s+)/);
				for (const part of parts) {
					if (part && !/^\s+$/.test(part)) {
						// Non-whitespace part is a class name
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
				continue; // Skip to next attribute
			}

			// JSX expression: className={'foo bar'} or class={clsx(...)}
			if (context.typescript.isJsxExpression(initializer)) {
				const expression = initializer.expression;

				if (!expression) {
					continue;
				}

				// Helper to add attributeId to extracted classes
				const addAttributeId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
					classes.map(c => ({ ...c, attributeId }));

				// OPTIMIZATION: Check type before delegating to extractor
				if (context.typescript.isStringLiteral(expression)) {
					classNames.push(...addAttributeId(this.expressionExtractor.extract(expression, context)));
				} else if (
					context.typescript.isTemplateExpression(expression) ||
					context.typescript.isNoSubstitutionTemplateLiteral(expression)
				) {
					classNames.push(...addAttributeId(this.templateExtractor.extract(expression, context)));
				} else if (context.typescript.isCallExpression(expression)) {
					if (this.shouldValidateFunctionCall(expression, context.utilityFunctions, context)) {
						classNames.push(
							...addAttributeId(this.expressionExtractor.extract(expression, context))
						);
					}
				} else if (
					context.typescript.isBinaryExpression(expression) ||
					context.typescript.isConditionalExpression(expression) ||
					context.typescript.isParenthesizedExpression(expression) ||
					context.typescript.isAsExpression(expression) ||
					context.typescript.isNonNullExpression(expression) ||
					context.typescript.isTypeAssertionExpression(expression)
				) {
					classNames.push(...addAttributeId(this.expressionExtractor.extract(expression, context)));
				}
				// Handle identifier references: className={dynamicClass} or class={dynamicClass}
				// This resolves the variable to its declared value for validation
				else if (context.typescript.isIdentifier(expression)) {
					classNames.push(
						...addAttributeId(this.expressionExtractor.extractFromIdentifier(expression, context))
					);
				}
				// Handle array literal expressions: className={['flex', 'items-center']} or class={['flex', 'items-center']}
				else if (context.typescript.isArrayLiteralExpression(expression)) {
					classNames.push(...addAttributeId(this.expressionExtractor.extract(expression, context)));
				}
				// Handle object literal expressions: className={{ flex: true }} or class={{ flex: true }}
				else if (context.typescript.isObjectLiteralExpression(expression)) {
					classNames.push(...addAttributeId(this.expressionExtractor.extract(expression, context)));
				}
			}
		}

		return classNames;
	}
}
