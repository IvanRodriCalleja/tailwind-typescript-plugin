import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';
import { TemplateExpressionExtractor } from './TemplateExpressionExtractor';

/**
 * Extracts class names from JSX className attributes
 * This is the main orchestrator for JSX elements
 */
export class JsxAttributeExtractor extends BaseExtractor {
	private expressionExtractor: ExpressionExtractor;
	private templateExtractor: TemplateExpressionExtractor;

	constructor() {
		super();
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

		if (
			!context.typescript.isJsxOpeningElement(node) &&
			!context.typescript.isJsxSelfClosingElement(node)
		) {
			return classNames;
		}

		const attributes = node.attributes.properties;

		for (const attr of attributes) {
			if (context.typescript.isJsxAttribute(attr) && attr.name.getText() === 'className') {
				const initializer = attr.initializer;

				if (!initializer) {
					continue;
				}

				// Handle string literal: className="foo bar"
				if (context.typescript.isStringLiteral(initializer)) {
					const fullText = initializer.text;
					const stringContentStart = initializer.getStart() + 1;
					const lineNumber =
						context.sourceFile.getLineAndCharacterOfPosition(attr.getStart()).line + 1;
					let offset = 0;

					fullText.split(' ').forEach(className => {
						if (className) {
							classNames.push({
								className: className,
								absoluteStart: stringContentStart + offset,
								length: className.length,
								line: lineNumber,
								file: context.sourceFile.fileName
							});
						}
						offset += className.length + 1;
					});
				}
				// Handle JSX expression: className={'foo bar'} or className={clsx(...)}
				else if (context.typescript.isJsxExpression(initializer)) {
					const expression = initializer.expression;

					if (!expression) {
						continue;
					}

					// Delegate to appropriate extractor based on expression type
					if (context.typescript.isStringLiteral(expression)) {
						classNames.push(...this.expressionExtractor.extract(expression, context));
					} else if (
						context.typescript.isTemplateExpression(expression) ||
						context.typescript.isNoSubstitutionTemplateLiteral(expression)
					) {
						classNames.push(...this.templateExtractor.extract(expression, context));
					} else if (context.typescript.isCallExpression(expression)) {
						if (this.shouldValidateFunctionCall(expression, context.utilityFunctions)) {
							classNames.push(...this.expressionExtractor.extract(expression, context));
						}
					} else if (
						context.typescript.isBinaryExpression(expression) ||
						context.typescript.isConditionalExpression(expression) ||
						context.typescript.isParenthesizedExpression(expression)
					) {
						classNames.push(...this.expressionExtractor.extract(expression, context));
					}
				}
			}
		}

		return classNames;
	}
}
