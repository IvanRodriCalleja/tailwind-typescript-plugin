import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext } from '../core/types';

/**
 * Abstract base class for all extractors
 * Provides common functionality and enforces the contract
 */
export abstract class BaseExtractor implements IClassNameExtractor {
	abstract canHandle(node: ts.Node, context: ExtractionContext): boolean;
	abstract extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[];

	/**
	 * Helper method to create ClassNameInfo from a string literal
	 * Handles both single-line and multiline strings with various whitespace
	 */
	protected extractFromStringLiteral(
		literal: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral,
		context: ExtractionContext
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const fullText = literal.text;
		const stringContentStart = literal.getStart() + 1;
		let offset = 0;

		// Split by whitespace (including newlines, tabs, etc.) while tracking position
		const parts = fullText.split(/(\s+)/);
		for (const part of parts) {
			if (part && !/^\s+$/.test(part)) {
				// Non-whitespace part is a class name
				classNames.push({
					className: part,
					absoluteStart: stringContentStart + offset,
					length: part.length,
					line:
						context.sourceFile.getLineAndCharacterOfPosition(stringContentStart + offset).line + 1,
					file: context.sourceFile.fileName
				});
			}
			offset += part.length;
		}

		return classNames;
	}

	/**
	 * Helper method to check if a function call should be validated
	 */
	protected shouldValidateFunctionCall(
		callExpression: ts.CallExpression,
		utilityFunctions: string[]
	): boolean {
		const expr = callExpression.expression;

		// Handle simple function calls: clsx('flex')
		if (ts.isIdentifier(expr)) {
			return utilityFunctions.includes(expr.text);
		}

		// Handle member expressions: utils.cn('flex'), lib.clsx('flex')
		if (ts.isPropertyAccessExpression(expr)) {
			return utilityFunctions.includes(expr.name.text);
		}

		// Ignore element access expressions and other types
		return false;
	}
}
