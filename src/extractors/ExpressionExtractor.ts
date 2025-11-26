import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';
import { VariableReferenceExtractor } from './VariableReferenceExtractor';

/**
 * Extracts class names from various expression types
 * This is a utility extractor used by other extractors to handle nested expressions
 */
export class ExpressionExtractor extends BaseExtractor {
	private variableExtractor: VariableReferenceExtractor;

	constructor() {
		super();
		this.variableExtractor = new VariableReferenceExtractor();
	}

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
	 * @param conditionalBranchId - Identifies which conditional branch this expression is in
	 */
	extractFromExpression(
		expression: ts.Expression,
		context: ExtractionContext,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const lineNumber =
			context.sourceFile.getLineAndCharacterOfPosition(expression.getStart()).line + 1;

		// Helper to add conditionalBranchId to extracted classes
		const addBranchId = (classes: ClassNameInfo[]): ClassNameInfo[] =>
			conditionalBranchId ? classes.map(c => ({ ...c, conditionalBranchId })) : classes;

		// Handle string literals
		if (context.typescript.isStringLiteral(expression)) {
			return addBranchId(this.extractFromStringLiteral(expression, context));
		}

		// Handle conditional expressions: condition ? 'class1' : 'class2'
		if (context.typescript.isConditionalExpression(expression)) {
			// Use the ternary's position as a unique identifier
			const ternaryId = expression.getStart();
			classNames.push(
				...this.extractFromExpression(expression.whenTrue, context, `ternary:true:${ternaryId}`)
			);
			classNames.push(
				...this.extractFromExpression(expression.whenFalse, context, `ternary:false:${ternaryId}`)
			);
		}
		// Handle binary expressions: condition && 'class-name'
		else if (context.typescript.isBinaryExpression(expression)) {
			if (
				expression.operatorToken.kind === context.typescript.SyntaxKind.AmpersandAmpersandToken ||
				expression.operatorToken.kind === context.typescript.SyntaxKind.BarBarToken
			) {
				classNames.push(
					...this.extractFromExpression(expression.right, context, conditionalBranchId)
				);
			}
		}
		// Handle call expressions: clsx('class1', 'class2', myVar)
		else if (context.typescript.isCallExpression(expression)) {
			if (this.shouldValidateFunctionCall(expression, context.utilityFunctions)) {
				expression.arguments.forEach(arg => {
					// Handle identifier arguments (variable references in function calls)
					if (context.typescript.isIdentifier(arg)) {
						const extracted = this.variableExtractor.extractFromIdentifier(arg, context);
						classNames.push(...addBranchId(extracted));
					} else {
						classNames.push(
							...this.extractFromExpression(arg as ts.Expression, context, conditionalBranchId)
						);
					}
				});
			}
		}
		// Handle parenthesized expressions: ('class-name') or (myVar)
		else if (context.typescript.isParenthesizedExpression(expression)) {
			const inner = expression.expression;
			// If inner is an identifier, resolve it as a variable reference
			if (context.typescript.isIdentifier(inner)) {
				const extracted = this.variableExtractor.extractFromIdentifier(inner, context);
				classNames.push(...addBranchId(extracted));
			} else {
				classNames.push(...this.extractFromExpression(inner, context, conditionalBranchId));
			}
		}
		// Handle type assertions: ('class-name' as string) or (myVar as string)
		else if (context.typescript.isAsExpression(expression)) {
			const inner = expression.expression;
			if (context.typescript.isIdentifier(inner)) {
				const extracted = this.variableExtractor.extractFromIdentifier(inner, context);
				classNames.push(...addBranchId(extracted));
			} else {
				classNames.push(...this.extractFromExpression(inner, context, conditionalBranchId));
			}
		}
		// Handle non-null assertions: expr! or myVar!
		else if (context.typescript.isNonNullExpression(expression)) {
			const inner = expression.expression;
			if (context.typescript.isIdentifier(inner)) {
				const extracted = this.variableExtractor.extractFromIdentifier(inner, context);
				classNames.push(...addBranchId(extracted));
			} else {
				classNames.push(...this.extractFromExpression(inner, context, conditionalBranchId));
			}
		}
		// Handle type assertions with angle brackets: <string>'class-name' (rare in JSX)
		else if (context.typescript.isTypeAssertionExpression(expression)) {
			const inner = expression.expression;
			if (context.typescript.isIdentifier(inner)) {
				const extracted = this.variableExtractor.extractFromIdentifier(inner, context);
				classNames.push(...addBranchId(extracted));
			} else {
				classNames.push(...this.extractFromExpression(inner, context, conditionalBranchId));
			}
		}
		// Handle array literal expressions: ['class1', 'class2', myVar]
		else if (context.typescript.isArrayLiteralExpression(expression)) {
			expression.elements.forEach(element => {
				// Handle identifier elements (variable references in arrays)
				if (context.typescript.isIdentifier(element)) {
					const extracted = this.variableExtractor.extractFromIdentifier(element, context);
					classNames.push(...addBranchId(extracted));
				} else {
					classNames.push(
						...this.extractFromExpression(element as ts.Expression, context, conditionalBranchId)
					);
				}
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
									file: context.sourceFile.fileName,
									conditionalBranchId
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
							file: context.sourceFile.fileName,
							conditionalBranchId
						});
					}
					// Handle computed property keys: { ['flex']: true } or { [myVar]: true }
					else if (context.typescript.isComputedPropertyName(name)) {
						const computedExpr = name.expression;
						// Handle identifier in computed property (variable reference)
						if (context.typescript.isIdentifier(computedExpr)) {
							const extracted = this.variableExtractor.extractFromIdentifier(
								computedExpr,
								context
							);
							classNames.push(...addBranchId(extracted));
						} else {
							classNames.push(
								...this.extractFromExpression(computedExpr, context, conditionalBranchId)
							);
						}
					}

					// Process the value - it might contain arrays, nested objects, etc.
					classNames.push(
						...this.extractFromExpression(property.initializer, context, conditionalBranchId)
					);
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
							file: context.sourceFile.fileName,
							conditionalBranchId
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
			classNames.push(...addBranchId(templateExtractor.extract(expression, context)));
		}
		// Handle no-substitution template literal
		else if (context.typescript.isNoSubstitutionTemplateLiteral(expression)) {
			return addBranchId(this.extractFromStringLiteral(expression, context));
		}
		// Note: Identifier handling is done in JsxAttributeExtractor for top-level variable references
		// We don't resolve identifiers here to avoid validating dynamic variables inside template interpolations

		return classNames;
	}

	/**
	 * Extract class names from an identifier by resolving its declaration
	 * This should only be called for top-level variable references in className
	 */
	extractFromIdentifier(identifier: ts.Identifier, context: ExtractionContext): ClassNameInfo[] {
		return this.variableExtractor.extractFromIdentifier(identifier, context);
	}
}
