import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext } from '../core/types';
import { CvaExtractor } from '../extractors/CvaExtractor';
import { JsxAttributeExtractor } from '../extractors/JsxAttributeExtractor';
import { TailwindVariantsExtractor } from '../extractors/TailwindVariantsExtractor';

/**
 * OPTIMIZED: Service responsible for orchestrating class name extraction
 *
 * Performance improvements:
 * 1. Fast path for JSX elements (skip non-JSX nodes early)
 * 2. Fast path for tv() calls (check only call expressions)
 * 3. Fast path for cva() calls (check only call expressions)
 * 4. Single extractor instance (avoid canHandle() overhead)
 * 5. Direct node type checking (faster than polymorphic calls)
 * 6. Reduced function call overhead
 * 7. Conditional extractor execution (skip disabled extractors)
 */
export class ClassNameExtractionService {
	private jsxExtractor: JsxAttributeExtractor;
	private tvExtractor: TailwindVariantsExtractor | null;
	private cvaExtractor: CvaExtractor | null;

	constructor(
		private readonly enableTailwindVariants: boolean = true,
		private readonly enableClassVarianceAuthority: boolean = true
	) {
		// Create extractors once and reuse (avoid recreation overhead)
		this.jsxExtractor = new JsxAttributeExtractor();
		this.tvExtractor = enableTailwindVariants ? new TailwindVariantsExtractor() : null;
		this.cvaExtractor = enableClassVarianceAuthority ? new CvaExtractor() : null;
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
			// FAST PATH 2: Check for variant library calls (tv, cva)
			// Only processes call expressions and only if extractors are enabled
			else if (typescript.isCallExpression(node)) {
				// Try tailwind-variants first (if enabled)
				if (this.tvExtractor) {
					const tvExtracted = this.tvExtractor.extract(node, context);
					if (tvExtracted.length > 0) {
						classNames.push(...tvExtracted);
					}
				}

				// Try class-variance-authority (if enabled)
				if (this.cvaExtractor) {
					const cvaExtracted = this.cvaExtractor.extract(node, context);
					if (cvaExtracted.length > 0) {
						classNames.push(...cvaExtracted);
					}
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
		if (this.tvExtractor) {
			this.tvExtractor.clearCache();
		}
		if (this.cvaExtractor) {
			this.cvaExtractor.clearCache();
		}
	}
}
