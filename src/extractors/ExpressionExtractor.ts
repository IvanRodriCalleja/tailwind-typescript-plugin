import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

/**
 * Extracts class names from various expression types
 * This is a utility extractor used by other extractors to handle nested expressions
 */
export class ExpressionExtractor extends BaseExtractor {
	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return (
			context.typescript.isExpression(node) ||
			context.typescript.isStringLiteral(node) ||
			context.typescript.isNoSubstitutionTemplateLiteral(node)
		);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		if (!context.typescript.isExpression(node as ts.Expression)) {
			return [];
		}
		return this.extractFromExpression(node as ts.Expression, context);
	}

	/**
	 * Recursively extract class names from any expression type
	 */
	extractFromExpression(expression: ts.Expression, context: ExtractionContext): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const lineNumber =
			context.sourceFile.getLineAndCharacterOfPosition(expression.getStart()).line + 1;

		// Handle string literals
		if (context.typescript.isStringLiteral(expression)) {
			return this.extractFromStringLiteral(expression, context);
		}

		// Handle conditional expressions: condition ? 'class1' : 'class2'
		if (context.typescript.isConditionalExpression(expression)) {
			classNames.push(...this.extractFromExpression(expression.whenTrue, context));
			classNames.push(...this.extractFromExpression(expression.whenFalse, context));
		}
		// Handle binary expressions: condition && 'class-name'
		else if (context.typescript.isBinaryExpression(expression)) {
			if (
				expression.operatorToken.kind === context.typescript.SyntaxKind.AmpersandAmpersandToken ||
				expression.operatorToken.kind === context.typescript.SyntaxKind.BarBarToken
			) {
				classNames.push(...this.extractFromExpression(expression.right, context));
			}
		}
		// Handle call expressions: clsx('class1', 'class2')
		else if (context.typescript.isCallExpression(expression)) {
			if (this.shouldValidateFunctionCall(expression, context.utilityFunctions)) {
				expression.arguments.forEach(arg => {
					classNames.push(...this.extractFromExpression(arg as ts.Expression, context));
				});
			}
		}
		// Handle parenthesized expressions: ('class-name')
		else if (context.typescript.isParenthesizedExpression(expression)) {
			classNames.push(...this.extractFromExpression(expression.expression, context));
		}
		// Handle array literal expressions: ['class1', 'class2']
		else if (context.typescript.isArrayLiteralExpression(expression)) {
			expression.elements.forEach(element => {
				classNames.push(...this.extractFromExpression(element as ts.Expression, context));
			});
		}
		// Handle object literal expressions: { 'class-name': true, 'another': condition }
		else if (context.typescript.isObjectLiteralExpression(expression)) {
			expression.properties.forEach(property => {
				// Handle regular property assignments: { 'flex': true }
				if (context.typescript.isPropertyAssignment(property)) {
					const name = property.name;

					// Handle string literal keys: { 'flex': true }
					if (context.typescript.isStringLiteral(name)) {
						const fullText = name.text;
						const stringContentStart = name.getStart() + 1;
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
					// Handle identifier keys: { flex: true }
					else if (context.typescript.isIdentifier(name)) {
						classNames.push({
							className: name.text,
							absoluteStart: name.getStart(),
							length: name.text.length,
							line: lineNumber,
							file: context.sourceFile.fileName
						});
					}
					// Handle computed property keys: { ['flex']: true }
					else if (context.typescript.isComputedPropertyName(name)) {
						classNames.push(...this.extractFromExpression(name.expression, context));
					}

					// Process the value - it might contain arrays, nested objects, etc.
					classNames.push(...this.extractFromExpression(property.initializer, context));
				}
				// Handle shorthand property assignments: { flex }
				else if (context.typescript.isShorthandPropertyAssignment(property)) {
					const name = property.name;
					if (context.typescript.isIdentifier(name)) {
						classNames.push({
							className: name.text,
							absoluteStart: name.getStart(),
							length: name.text.length,
							line: lineNumber,
							file: context.sourceFile.fileName
						});
					}
				}
			});
		}
		// Handle template expressions
		else if (context.typescript.isTemplateExpression(expression)) {
			// Import and use TemplateExpressionExtractor to avoid circular dependency
			const { TemplateExpressionExtractor } = require('./TemplateExpressionExtractor');
			const templateExtractor = new TemplateExpressionExtractor();
			classNames.push(...templateExtractor.extract(expression, context));
		}
		// Handle no-substitution template literal
		else if (context.typescript.isNoSubstitutionTemplateLiteral(expression)) {
			return this.extractFromStringLiteral(expression, context);
		}

		return classNames;
	}
}
