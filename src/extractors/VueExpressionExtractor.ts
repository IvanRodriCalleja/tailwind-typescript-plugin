import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext, UtilitiesConfig } from '../core/types';
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
	 * Override to handle Vue's __VLS_ctx pattern for property access.
	 *
	 * Vue generates code like __VLS_ctx.variable for template variable references.
	 * This method resolves these to their actual values.
	 */
	override extractFromExpression(
		expression: ts.Expression,
		context: ExtractionContext,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const { typescript } = context;

		// Handle __VLS_ctx.propertyName patterns (Vue variable references)
		if (typescript.isPropertyAccessExpression(expression)) {
			const objectExpr = expression.expression;
			if (typescript.isIdentifier(objectExpr) && objectExpr.text === '__VLS_ctx') {
				const propertyName = expression.name;
				if (typescript.isIdentifier(propertyName)) {
					const resolved = this.resolveVlsCtxProperty(propertyName, context);
					if (resolved.length > 0) {
						// Add conditionalBranchId if present
						if (conditionalBranchId) {
							return resolved.map(c => ({ ...c, conditionalBranchId }));
						}
						return resolved;
					}
				}
			}
		}

		// Fall back to base implementation
		return super.extractFromExpression(expression, context, conditionalBranchId);
	}

	/**
	 * Resolve a property from __VLS_ctx to its actual value.
	 */
	private resolveVlsCtxProperty(
		propertyName: ts.Identifier,
		context: ExtractionContext
	): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		if (!typeChecker) {
			return [];
		}

		const symbol = typeChecker.getSymbolAtLocation(propertyName);
		if (!symbol) {
			return [];
		}

		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		for (const declaration of declarations) {
			// Handle PropertySignature with typeof (Volar 3.x)
			if (typescript.isPropertySignature(declaration) && declaration.type) {
				if (typescript.isTypeQueryNode(declaration.type)) {
					const exprName = declaration.type.exprName;
					if (typescript.isIdentifier(exprName)) {
						const varSymbol = typeChecker.getSymbolAtLocation(exprName);
						if (varSymbol) {
							const varDeclarations = varSymbol.getDeclarations();
							if (varDeclarations) {
								for (const varDecl of varDeclarations) {
									if (typescript.isVariableDeclaration(varDecl) && varDecl.initializer) {
										// Extract from the initializer using base class method
										return super.extractFromExpression(varDecl.initializer, context);
									}
								}
							}
						}
					}
				}
			}
			// Handle direct variable declaration
			else if (typescript.isVariableDeclaration(declaration) && declaration.initializer) {
				return super.extractFromExpression(declaration.initializer, context);
			}
			// Handle property assignment
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
									return super.extractFromExpression(refDecl.initializer, context);
								}
							}
						}
					}
				}
			}
		}

		return [];
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
		utilities: UtilitiesConfig,
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
					const source = utilities[functionName];

					if (source === undefined || source === 'off') {
						return false;
					}
					if (source === '*') {
						return true;
					}
					// Specific import path: verify direct import
					return this.isImportedFrom(functionName, source, context);
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
						const source = utilities[functionName];

						if (source === undefined || source === 'off') {
							return false;
						}
						if (source === '*') {
							return true;
						}
						// Specific import path: verify namespace import
						return this.isNamespaceImportedFrom(namespaceName, source, context);
					}
				}
			}
		}

		// Fall back to base implementation for non-Vue patterns
		return super.shouldValidateFunctionCall(callExpression, utilities, context);
	}
}
