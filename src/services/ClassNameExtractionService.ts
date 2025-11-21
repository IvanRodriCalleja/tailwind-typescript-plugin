import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext } from '../core/types';
import { JsxAttributeExtractor } from '../extractors/JsxAttributeExtractor';
import { TailwindVariantsExtractor } from '../extractors/TailwindVariantsExtractor';

/**
 * OPTIMIZED: Service responsible for orchestrating class name extraction
 *
 * Performance improvements:
 * 1. Fast path for JSX elements (skip non-JSX nodes early)
 * 2. Fast path for tv() calls (check only call expressions)
 * 3. Single extractor instance (avoid canHandle() overhead)
 * 4. Direct node type checking (faster than polymorphic calls)
 * 5. Reduced function call overhead
 */
export class ClassNameExtractionService {
	private jsxExtractor: JsxAttributeExtractor;
	private tvExtractor: TailwindVariantsExtractor;

	constructor() {
		// Create extractors once and reuse (avoid recreation overhead)
		this.jsxExtractor = new JsxAttributeExtractor();
		this.tvExtractor = new TailwindVariantsExtractor();
	}

	/**
	 * Extract all class names from a source file (OPTIMIZED)
	 */
	extractFromSourceFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilityFunctions: string[],
		typeChecker?: ts.TypeChecker
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];
		const context: ExtractionContext = {
			typescript,
			sourceFile,
			utilityFunctions,
			typeChecker
		};

		// OPTIMIZATION: Direct node type checking in visit function
		// Avoids canHandle() overhead for every node
		const visit = (node: ts.Node): void => {
			// FAST PATH 1: Only process JSX opening/self-closing elements
			// This skips ~98% of nodes immediately
			if (typescript.isJsxOpeningElement(node) || typescript.isJsxSelfClosingElement(node)) {
				// Direct extraction without canHandle() check
				const extracted = this.jsxExtractor.extract(node, context);
				if (extracted.length > 0) {
					classNames.push(...extracted);
				}
			}
			// FAST PATH 2: Check for tv() calls from tailwind-variants
			// Only processes call expressions
			else if (typescript.isCallExpression(node)) {
				const extracted = this.tvExtractor.extract(node, context);
				if (extracted.length > 0) {
					classNames.push(...extracted);
				}
			}

			// Continue traversing (TypeScript handles this efficiently)
			typescript.forEachChild(node, visit);
		};

		visit(sourceFile);
		return classNames;
	}

	/**
	 * Add a custom extractor (for extensibility)
	 * Note: This is kept for API compatibility but not used in optimized path
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	addExtractor(_extractor: IClassNameExtractor): void {
		// In the optimized version, we could extend this to support
		// multiple extractors while maintaining performance
		console.warn('Custom extractors not yet supported in optimized version');
	}

	/**
	 * Clear caches (useful when files change)
	 */
	clearCaches(): void {
		this.tvExtractor.clearCache();
	}
}
