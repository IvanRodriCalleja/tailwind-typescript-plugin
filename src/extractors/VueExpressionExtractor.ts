import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext, UtilityFunction } from '../core/types';
import { ExpressionExtractor } from './ExpressionExtractor';

/**
 * Vue-specific expression extractor that handles Vue's __VLS_ctx pattern.
 *
 * When @vue/language-tools transforms Vue SFC templates, imported functions
 * are accessed through __VLS_ctx (e.g., __VLS_ctx.clsx(...) instead of clsx(...)).
 * This extractor recognizes this pattern and validates the underlying import.
 */
export class VueExpressionExtractor extends ExpressionExtractor {
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
}
