import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

/**
 * Extracts class names from variable references by resolving their declarations.
 * Errors point to the actual class name in the declaration, with context about
 * where the variable is used.
 *
 * Handles cases like:
 * - const dynamicClass = 'bg-blue-500';
 *   <div className={dynamicClass}>
 *
 * - const classes = isActive ? 'bg-blue-500' : 'bg-gray-500';
 *   <div className={classes}>
 */
export class VariableReferenceExtractor extends BaseExtractor {
	canHandle(node: ts.Node, context: ExtractionContext): boolean {
		return context.typescript.isIdentifier(node);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		if (!context.typescript.isIdentifier(node)) {
			return [];
		}

		return this.extractFromIdentifier(node, context);
	}

	/**
	 * Extract class names from an identifier by resolving its declaration
	 */
	extractFromIdentifier(identifier: ts.Identifier, context: ExtractionContext): ClassNameInfo[] {
		const { typescript, typeChecker } = context;

		// TypeChecker is required for symbol resolution
		if (!typeChecker) {
			return [];
		}

		// Get the symbol for this identifier
		const symbol = typeChecker.getSymbolAtLocation(identifier);
		if (!symbol) {
			return [];
		}

		// Get the declaration(s) for this symbol
		const declarations = symbol.getDeclarations();
		if (!declarations || declarations.length === 0) {
			return [];
		}

		// Get variable usage info for better error messages
		const variableName = identifier.getText();
		const usageLine =
			context.sourceFile.getLineAndCharacterOfPosition(identifier.getStart()).line + 1;
		const variableUsage = { variableName, usageLine };

		const classNames: ClassNameInfo[] = [];

		for (const declaration of declarations) {
			// Handle variable declarations: const foo = 'string' | condition ? 'a' : 'b'
			if (typescript.isVariableDeclaration(declaration)) {
				const initializer = declaration.initializer;
				if (initializer) {
					classNames.push(...this.extractFromInitializer(initializer, variableUsage, context));
				}
			}
			// Handle parameter declarations with default values
			else if (typescript.isParameter(declaration)) {
				const initializer = declaration.initializer;
				if (initializer) {
					classNames.push(...this.extractFromInitializer(initializer, variableUsage, context));
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from an initializer expression
	 * Reports errors at the declaration position (where the string literal is)
	 * @param conditionalBranchId - Identifies which conditional branch this expression is in
	 */
	private extractFromInitializer(
		initializer: ts.Expression,
		variableUsage: { variableName: string; usageLine: number },
		context: ExtractionContext,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const { typescript } = context;
		const classNames: ClassNameInfo[] = [];

		// Handle string literals: const foo = 'bg-blue-500'
		if (typescript.isStringLiteral(initializer)) {
			classNames.push(
				...this.extractFromStringLiteralWithUsage(
					initializer,
					variableUsage,
					context,
					conditionalBranchId
				)
			);
		}
		// Handle no-substitution template literals: const foo = `bg-blue-500`
		else if (typescript.isNoSubstitutionTemplateLiteral(initializer)) {
			classNames.push(
				...this.extractFromStringLiteralWithUsage(
					initializer,
					variableUsage,
					context,
					conditionalBranchId
				)
			);
		}
		// Handle conditional expressions: const foo = condition ? 'bg-blue-500' : 'bg-gray-500'
		else if (typescript.isConditionalExpression(initializer)) {
			// Use the ternary's position as a unique identifier
			const ternaryId = initializer.getStart();
			classNames.push(
				...this.extractFromInitializer(
					initializer.whenTrue,
					variableUsage,
					context,
					`ternary:true:${ternaryId}`
				)
			);
			classNames.push(
				...this.extractFromInitializer(
					initializer.whenFalse,
					variableUsage,
					context,
					`ternary:false:${ternaryId}`
				)
			);
		}
		// Handle binary expressions: const foo = condition && 'bg-blue-500'
		else if (typescript.isBinaryExpression(initializer)) {
			if (
				initializer.operatorToken.kind === typescript.SyntaxKind.AmpersandAmpersandToken ||
				initializer.operatorToken.kind === typescript.SyntaxKind.BarBarToken
			) {
				classNames.push(
					...this.extractFromInitializer(
						initializer.right,
						variableUsage,
						context,
						conditionalBranchId
					)
				);
			}
		}
		// Handle parenthesized expressions: const foo = ('bg-blue-500')
		else if (typescript.isParenthesizedExpression(initializer)) {
			classNames.push(
				...this.extractFromInitializer(
					initializer.expression,
					variableUsage,
					context,
					conditionalBranchId
				)
			);
		}
		// Handle type assertions: const foo = 'bg-blue-500' as const
		else if (typescript.isAsExpression(initializer)) {
			classNames.push(
				...this.extractFromInitializer(
					initializer.expression,
					variableUsage,
					context,
					conditionalBranchId
				)
			);
		}
		// Handle template expressions with interpolation - extract static parts only
		else if (typescript.isTemplateExpression(initializer)) {
			// Extract from head
			const headText = initializer.head.text;
			if (headText.trim()) {
				const headStart = initializer.head.getStart() + 1; // +1 for opening backtick
				const headLine = context.sourceFile.getLineAndCharacterOfPosition(headStart).line + 1;
				classNames.push(
					...this.extractClassNamesFromText(
						headText,
						headStart,
						headLine,
						variableUsage,
						context,
						conditionalBranchId
					)
				);
			}
			// Extract from template spans (parts between and after interpolations)
			for (const span of initializer.templateSpans) {
				const spanText = span.literal.text;
				if (spanText.trim()) {
					const spanStart = span.literal.getStart() + 1;
					const spanLine = context.sourceFile.getLineAndCharacterOfPosition(spanStart).line + 1;
					classNames.push(
						...this.extractClassNamesFromText(
							spanText,
							spanStart,
							spanLine,
							variableUsage,
							context,
							conditionalBranchId
						)
					);
				}
			}
		}
		// Handle array literal expressions: const classes = ['flex', 'items-center']
		else if (typescript.isArrayLiteralExpression(initializer)) {
			for (const element of initializer.elements) {
				// Skip empty array holes: [, , 'flex']
				if (element === undefined) {
					continue;
				}
				// Handle spread elements: [...otherClasses]
				if (typescript.isSpreadElement(element)) {
					classNames.push(
						...this.extractFromInitializer(
							element.expression,
							variableUsage,
							context,
							conditionalBranchId
						)
					);
				}
				// Handle identifiers (variable references)
				else if (typescript.isIdentifier(element)) {
					classNames.push(...this.extractFromIdentifier(element, context));
				}
				// Handle other expressions (strings, conditionals, etc.)
				else {
					classNames.push(
						...this.extractFromInitializer(element, variableUsage, context, conditionalBranchId)
					);
				}
			}
		}

		return classNames;
	}

	/**
	 * Extract class names from a string literal, pointing errors at the literal position
	 * Handles both single-line and multiline strings with various whitespace
	 */
	private extractFromStringLiteralWithUsage(
		literal: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral,
		variableUsage: { variableName: string; usageLine: number },
		context: ExtractionContext,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const fullText = literal.text;
		const stringContentStart = literal.getStart() + 1; // +1 for opening quote
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
					file: context.sourceFile.fileName,
					variableUsage,
					conditionalBranchId
				});
			}
			offset += part.length;
		}

		return classNames;
	}

	/**
	 * Extract class names from text, tracking offsets for accurate positions
	 */
	private extractClassNamesFromText(
		text: string,
		startPosition: number,
		line: number,
		variableUsage: { variableName: string; usageLine: number },
		context: ExtractionContext,
		conditionalBranchId?: string
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		let offset = 0;

		// Split by whitespace, keeping track of position
		const parts = text.split(/(\s+)/);
		for (const part of parts) {
			if (part.trim()) {
				classNames.push({
					className: part,
					absoluteStart: startPosition + offset,
					length: part.length,
					line,
					file: context.sourceFile.fileName,
					variableUsage,
					conditionalBranchId
				});
			}
			offset += part.length;
		}

		return classNames;
	}
}
