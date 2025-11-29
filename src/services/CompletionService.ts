import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { Logger } from '../utils/Logger';

/**
 * Completion context information extracted from the source file
 */
interface CompletionContext {
	/** Whether we're inside a className-like attribute */
	isInClassNameContext: boolean;
	/** The current word/prefix being typed (text from last space or start of string to cursor) */
	currentPrefix: string;
	/** The start position of the current prefix in the source file */
	prefixStart: number;
	/** The position of the string literal start (for replacement span calculation) */
	stringStart: number;
	/** All classes already in the className (for filtering duplicates) */
	existingClasses: Set<string>;
}

/**
 * Service that provides autocompletion for Tailwind CSS class names
 *
 * Provides completions when:
 * - Cursor is inside a className attribute's string literal
 * - Cursor is inside a utility function argument (clsx, cn, classnames, etc.)
 * - Cursor is inside tv() or cva() class strings
 *
 * Features:
 * - Filters completions based on what's already typed
 * - Excludes classes already present in the same className
 * - Handles space-separated class lists properly
 */
export class CompletionService {
	/** Cached sorted class list for faster completion generation */
	private cachedClassList: string[] | null = null;

	constructor(
		private readonly validator: TailwindValidator,
		private readonly logger: Logger
	) {}

	/**
	 * Get completions at the given position
	 */
	getCompletionsAtPosition(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		position: number,
		existingCompletions: ts.CompletionInfo | undefined
	): ts.CompletionInfo | undefined {
		const context = this.getCompletionContext(typescript, sourceFile, position);

		if (!context.isInClassNameContext) {
			this.logger.log('[CompletionService] Not in className context, returning original completions');
			return existingCompletions;
		}

		this.logger.log(
			`[CompletionService] In className context, prefix="${context.currentPrefix}", existingClasses=${context.existingClasses.size}`
		);

		const tailwindCompletions = this.generateCompletions(
			typescript,
			context,
			sourceFile.fileName
		);

		if (tailwindCompletions.length === 0) {
			return existingCompletions;
		}

		// Create completion info with Tailwind classes
		const completionInfo: ts.CompletionInfo = {
			isGlobalCompletion: false,
			isMemberCompletion: false,
			isNewIdentifierLocation: false,
			entries: tailwindCompletions
		};

		return completionInfo;
	}

	/**
	 * Get completion entry details for a specific completion item
	 * Formats the documentation with markdown CSS code blocks for syntax highlighting
	 */
	getCompletionEntryDetails(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		position: number,
		entryName: string
	): ts.CompletionEntryDetails | undefined {
		// Check if this is a Tailwind class completion
		if (!this.isTailwindClass(entryName)) {
			return undefined;
		}

		// Get the CSS for this class
		const cssResults = this.validator.getCssForClasses([entryName]);
		const css = cssResults[0];

		const documentation: ts.SymbolDisplayPart[] = [];

		if (css) {
			// Format the CSS with proper structure like Tailwind IntelliSense
			const formattedCss = this.formatCssForDisplay(css, entryName);

			// Use markdown code block for syntax highlighting
			documentation.push({
				kind: 'text',
				text: '```css\n' + formattedCss + '\n```'
			});
		}

		// Extract just the declarations for the detail (short summary)
		const detail = css ? this.extractCssDeclarations(css) : undefined;

		// Check if this is a color class for the icon
		const isColor = this.isColorClass(entryName);

		return {
			name: entryName,
			kind: typescript.ScriptElementKind.string,
			// Set 'color' kindModifier for color classes so VS Code shows color icon
			kindModifiers: isColor ? 'color' : '',
			displayParts: detail
				? [{ kind: 'text', text: detail }]
				: [{ kind: 'text', text: entryName }],
			documentation
		};
	}

	/**
	 * Format CSS output for display in the completion documentation
	 * Transforms the raw Tailwind CSS output into a nicely formatted rule block
	 */
	private formatCssForDisplay(css: string, className: string): string {
		// The CSS from Tailwind typically looks like:
		// .flex { display: flex; }
		// We want to format it nicely with proper indentation

		// First, let's clean up and format the CSS
		let formatted = css.trim();

		// If it's already well-formatted, return as-is
		if (formatted.includes('\n')) {
			return formatted;
		}

		// Single-line CSS: format it nicely
		// Match pattern: .selector { declarations }
		const singleLineMatch = formatted.match(/^([^{]+)\{([^}]+)\}$/);
		if (singleLineMatch) {
			const selector = singleLineMatch[1].trim();
			const declarations = singleLineMatch[2].trim();

			// Split declarations and format each on its own line
			const declParts = declarations
				.split(';')
				.map(d => d.trim())
				.filter(d => d.length > 0);

			if (declParts.length === 1) {
				// Single declaration: keep on one line
				return `${selector} {\n  ${declParts[0]};\n}`;
			} else {
				// Multiple declarations: each on its own line
				const formattedDecls = declParts.map(d => `  ${d};`).join('\n');
				return `${selector} {\n${formattedDecls}\n}`;
			}
		}

		return formatted;
	}

	/**
	 * Extract just the CSS declarations from a CSS rule for the detail summary
	 * e.g., ".flex { display: flex; }" -> "display: flex;"
	 */
	private extractCssDeclarations(css: string): string {
		// Match the content inside the curly braces
		const match = css.match(/\{([^}]+)\}/);
		if (match) {
			// Clean up the declarations
			return match[1]
				.trim()
				.split(';')
				.map(d => d.trim())
				.filter(d => d.length > 0)
				.join('; ') + ';';
		}
		return css.trim();
	}

	/**
	 * Check if a name is a valid Tailwind class
	 */
	private isTailwindClass(name: string): boolean {
		return this.validator.isValidClass(name);
	}

	/**
	 * Analyze the source file at the given position to determine completion context
	 */
	private getCompletionContext(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		position: number
	): CompletionContext {
		const defaultContext: CompletionContext = {
			isInClassNameContext: false,
			currentPrefix: '',
			prefixStart: position,
			stringStart: position,
			existingClasses: new Set()
		};

		// Find the node at the current position
		let node = this.findNodeAtPosition(typescript, sourceFile, position);
		if (!node) {
			this.logger.log(`[CompletionService] No node found at position ${position}`);
			return defaultContext;
		}

		this.logger.log(
			`[CompletionService] Found node kind: ${typescript.SyntaxKind[node.kind]} at position ${position}`
		);

		// If we found a JsxAttribute, look for its string literal initializer
		if (typescript.isJsxAttribute(node)) {
			const initializer = node.initializer;
			if (initializer && typescript.isStringLiteral(initializer)) {
				node = initializer;
				this.logger.log(`[CompletionService] Found string literal in JsxAttribute initializer`);
			}
		}

		// Check if we're in a string literal
		if (!typescript.isStringLiteral(node) && !typescript.isNoSubstitutionTemplateLiteral(node)) {
			this.logger.log(
				`[CompletionService] Node is not a string literal: ${typescript.SyntaxKind[node.kind]}`
			);
			return defaultContext;
		}

		// Check if this string is in a className context
		if (!this.isClassNameContext(typescript, node)) {
			this.logger.log(`[CompletionService] Node is not in className context`);
			return defaultContext;
		}

		// We're in a className context! Now extract the completion details
		const stringContent = node.text;
		const stringStart = node.getStart(sourceFile) + 1; // +1 to skip the opening quote
		const positionInString = position - stringStart;

		// Handle cursor at or before string start
		if (positionInString < 0) {
			return defaultContext;
		}

		// Find the current "word" being typed (from last space to cursor)
		const textBeforeCursor = stringContent.substring(0, positionInString);
		const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
		const currentPrefix = lastSpaceIndex === -1
			? textBeforeCursor
			: textBeforeCursor.substring(lastSpaceIndex + 1);
		const prefixStart = stringStart + (lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1);

		// Get all existing classes in this attribute (for duplicate filtering)
		const existingClasses = new Set(
			stringContent
				.split(/\s+/)
				.filter(c => c.length > 0)
		);

		// Remove the current prefix from existing classes if it's a partial match
		// (so we can still suggest completions for partially typed classes)
		if (currentPrefix) {
			existingClasses.delete(currentPrefix);
		}

		return {
			isInClassNameContext: true,
			currentPrefix,
			prefixStart,
			stringStart,
			existingClasses
		};
	}

	/**
	 * Find the deepest node at the given position
	 * Uses TypeScript's built-in method which handles edge cases better
	 */
	private findNodeAtPosition(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		position: number
	): ts.Node | undefined {
		function find(node: ts.Node): ts.Node | undefined {
			// Use getStart without sourceFile to include trivia, which helps with edge positions
			const start = node.getStart(sourceFile);
			const end = node.getEnd();

			// Position must be within the node's range (inclusive of end for completions)
			if (position < start || position > end) {
				return undefined;
			}

			// Check children first to find the deepest matching node
			let result: ts.Node | undefined;
			typescript.forEachChild(node, child => {
				const found = find(child);
				if (found) {
					result = found;
				}
			});

			return result || node;
		}

		return find(sourceFile);
	}

	/**
	 * Check if a string literal node is in a className-like context
	 */
	private isClassNameContext(
		typescript: typeof ts,
		node: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral
	): boolean {
		const parent = node.parent;

		// Case 1: JSX attribute like className="..."
		if (typescript.isJsxAttribute(parent)) {
			const attrName = parent.name.getText();
			return this.isClassNameAttribute(attrName);
		}

		// Case 2: Property assignment like { className: "..." }
		if (typescript.isPropertyAssignment(parent)) {
			const propName = parent.name.getText();
			return this.isClassNameAttribute(propName);
		}

		// Case 3: Inside a call expression (utility function like clsx, cn, etc.)
		// Check parent chain for call expression
		let current: ts.Node = node;
		while (current.parent) {
			current = current.parent;

			if (typescript.isCallExpression(current)) {
				const callName = this.getCallExpressionName(typescript, current);
				if (callName && this.isUtilityFunction(callName)) {
					return true;
				}
			}

			// Case 4: Inside tv() or cva() variant definitions
			if (typescript.isPropertyAssignment(current)) {
				const parentCall = this.findParentCallExpression(typescript, current);
				if (parentCall) {
					const callName = this.getCallExpressionName(typescript, parentCall);
					if (callName === 'tv' || callName === 'cva') {
						return true;
					}
				}
			}

			// Stop at certain boundaries
			if (
				typescript.isBlock(current) ||
				typescript.isSourceFile(current) ||
				typescript.isFunctionDeclaration(current) ||
				typescript.isArrowFunction(current)
			) {
				break;
			}
		}

		return false;
	}

	/**
	 * Check if an attribute name is a className-like attribute
	 */
	private isClassNameAttribute(name: string): boolean {
		const classNameAttributes = [
			'className',
			'class',
			'classname', // case variations
			'classList'
		];
		return classNameAttributes.includes(name) || classNameAttributes.includes(name.toLowerCase());
	}

	/**
	 * Check if a function name is a common utility function for class names
	 */
	private isUtilityFunction(name: string): boolean {
		const utilityFunctions = [
			'clsx',
			'cn',
			'classnames',
			'classNames',
			'cx',
			'cva',
			'tv',
			'twMerge',
			'twJoin'
		];
		return utilityFunctions.includes(name);
	}

	/**
	 * Get the name of a call expression
	 */
	private getCallExpressionName(
		typescript: typeof ts,
		callExpr: ts.CallExpression
	): string | undefined {
		const expr = callExpr.expression;

		if (typescript.isIdentifier(expr)) {
			return expr.text;
		}

		if (typescript.isPropertyAccessExpression(expr)) {
			return expr.name.text;
		}

		return undefined;
	}

	/**
	 * Find the parent call expression of a node
	 */
	private findParentCallExpression(
		typescript: typeof ts,
		node: ts.Node
	): ts.CallExpression | undefined {
		let current: ts.Node | undefined = node.parent;

		while (current) {
			if (typescript.isCallExpression(current)) {
				return current;
			}

			if (
				typescript.isBlock(current) ||
				typescript.isSourceFile(current) ||
				typescript.isFunctionDeclaration(current)
			) {
				break;
			}

			current = current.parent;
		}

		return undefined;
	}

	/**
	 * Generate completion entries for Tailwind classes
	 */
	private generateCompletions(
		typescript: typeof ts,
		context: CompletionContext,
		fileName: string
	): ts.CompletionEntry[] {
		// Get all classes from the validator
		const allClasses = this.getClassList();
		const prefix = context.currentPrefix.toLowerCase();

		// Filter and create completion entries
		const entries: ts.CompletionEntry[] = [];

		for (const className of allClasses) {
			// Skip classes that are already in the attribute
			if (context.existingClasses.has(className)) {
				continue;
			}

			// Filter by prefix if one is being typed
			if (prefix && !className.toLowerCase().startsWith(prefix)) {
				continue;
			}

			// Check if this is a color-related class
			const isColorClass = this.isColorClass(className);

			entries.push({
				name: className,
				kind: typescript.ScriptElementKind.string,
				// VS Code recognizes 'color' kindModifier and shows a color icon
				kindModifiers: isColorClass ? 'color' : '',
				sortText: this.getSortText(className, prefix),
				insertText: className,
				replacementSpan: {
					start: context.prefixStart,
					length: context.currentPrefix.length
				}
			});
		}

		this.logger.log(`[CompletionService] Generated ${entries.length} completions for prefix "${prefix}"`);

		return entries;
	}

	/**
	 * Get the cached class list, initializing if necessary
	 */
	private getClassList(): string[] {
		if (this.cachedClassList === null) {
			this.cachedClassList = this.validator.getAllClasses().sort();
			this.logger.log(`[CompletionService] Cached ${this.cachedClassList.length} classes`);
		}
		return this.cachedClassList;
	}

	/**
	 * Clear the cached class list (call when design system reloads)
	 */
	clearCache(): void {
		this.cachedClassList = null;
	}

	/**
	 * Check if a class name is related to colors
	 * Uses a pattern-based approach to detect color classes efficiently
	 */
	private isColorClass(className: string): boolean {
		// Color-related prefixes in Tailwind CSS
		// These patterns match classes that typically set colors
		const colorPrefixes = [
			'bg-',          // background-color
			'text-',        // color (text color)
			'border-',      // border-color (but not border-0, border-2, etc.)
			'ring-',        // ring-color (but not ring-0, ring-1, etc.)
			'outline-',     // outline-color (but not outline-0, outline-1, etc.)
			'shadow-',      // box-shadow colors (but not shadow-sm, shadow-lg, etc.)
			'accent-',      // accent-color
			'caret-',       // caret-color
			'fill-',        // SVG fill
			'stroke-',      // SVG stroke
			'from-',        // gradient from color
			'via-',         // gradient via color
			'to-',          // gradient to color
			'divide-',      // divide color (but not divide-x, divide-y)
			'placeholder-', // placeholder color
			'decoration-'   // text-decoration-color
		];

		// Check if class starts with any color prefix
		const hasColorPrefix = colorPrefixes.some(prefix => className.startsWith(prefix));
		if (!hasColorPrefix) {
			return false;
		}

		// Filter out non-color variants of these prefixes
		// These are utilities that use the same prefix but aren't colors
		const nonColorPatterns = [
			// Border utilities that aren't colors
			/^border-[0-8]$/,
			/^border-(collapse|separate|spacing|none|hidden|solid|dashed|dotted|double)$/,
			/^border-(x|y|t|r|b|l|s|e)-[0-8]$/,
			// Ring utilities that aren't colors
			/^ring-[0-8]$/,
			/^ring-(inset|offset-[0-8])$/,
			// Outline utilities that aren't colors
			/^outline-[0-8]$/,
			/^outline-(none|dashed|dotted|double|offset-[0-8])$/,
			// Shadow utilities that aren't colors
			/^shadow-(sm|md|lg|xl|2xl|inner|none)$/,
			// Divide utilities that aren't colors
			/^divide-(x|y)(-[0-8]|-reverse)?$/,
			/^divide-(solid|dashed|dotted|double|none)$/,
			// Text utilities that aren't colors (sizes, alignment, etc.)
			/^text-(xs|sm|base|lg|xl|[2-9]xl|left|center|right|justify|start|end|wrap|nowrap|balance|pretty)$/,
			// Stroke width
			/^stroke-[0-2]$/,
			// Decoration utilities that aren't colors
			/^decoration-(slice|clone|solid|double|dotted|dashed|wavy|auto|from-font|[0-8])$/
		];

		// If it matches any non-color pattern, it's not a color class
		if (nonColorPatterns.some(pattern => pattern.test(className))) {
			return false;
		}

		// Additional check: color classes typically have a color name or number
		// e.g., bg-red-500, text-blue-200, border-gray-300
		// or named colors like bg-white, text-black, bg-transparent
		const afterPrefix = className.replace(/^[a-z]+-/, '');

		// Common color indicators
		const colorIndicators = [
			// Color names
			/^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+$/,
			// Special colors
			/^(black|white|transparent|current|inherit)$/,
			// Arbitrary colors
			/^\[.*\]$/,
			// Opacity variants on colors
			/^.*\/\d+$/
		];

		return colorIndicators.some(pattern => pattern.test(afterPrefix));
	}

	/**
	 * Generate sort text for completion ordering
	 * Classes that start with the prefix get priority
	 */
	private getSortText(className: string, prefix: string): string {
		// Exact match gets highest priority
		if (className === prefix) {
			return '0' + className;
		}

		// Prefix match gets high priority
		if (prefix && className.toLowerCase().startsWith(prefix.toLowerCase())) {
			return '1' + className;
		}

		// Everything else sorted alphabetically
		return '2' + className;
	}
}
