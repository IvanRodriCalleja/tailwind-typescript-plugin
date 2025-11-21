import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { ExpressionExtractor } from './ExpressionExtractor';

/**
 * Extracts class names from template expressions
 * Example: `flex ${condition ? 'hidden' : 'block'}`
 */
export class TemplateExpressionExtractor extends BaseExtractor {
	private expressionExtractor: ExpressionExtractor;

	constructor() {
		super();
		this.expressionExtractor = new ExpressionExtractor();
	}

	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return (
			context.typescript.isTemplateExpression(node) ||
			context.typescript.isNoSubstitutionTemplateLiteral(node)
		);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Handle no-substitution template literal: `flex items-center`
		if (context.typescript.isNoSubstitutionTemplateLiteral(node)) {
			return this.extractFromStringLiteral(node, context);
		}

		// Handle template expression with substitutions
		if (context.typescript.isTemplateExpression(node)) {
			const parts: Array<{ text: string; start: number }> = [];

			// Add the head (the part before the first ${})
			parts.push({
				text: node.head.text,
				start: node.head.getStart() + 1
			});

			// Add each template span's literal part
			node.templateSpans.forEach(span => {
				// Extract from the interpolated expression
				const expressionClasses = this.expressionExtractor.extractFromExpression(
					span.expression,
					context
				);
				classNames.push(...expressionClasses);

				// Add the literal part after the interpolation
				parts.push({
					text: span.literal.text,
					start: span.literal.getStart() + 1
				});
			});

			// Process each static part for class names
			parts.forEach(part => {
				let offset = 0;
				const lineNumber = context.sourceFile.getLineAndCharacterOfPosition(part.start).line + 1;

				part.text.split(' ').forEach(className => {
					if (className) {
						classNames.push({
							className: className,
							absoluteStart: part.start + offset,
							length: className.length,
							line: lineNumber,
							file: context.sourceFile.fileName
						});
					}
					offset += className.length + 1;
				});
			});
		}

		return classNames;
	}
}
