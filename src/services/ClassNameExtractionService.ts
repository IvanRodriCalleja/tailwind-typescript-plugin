import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext, UtilityFunction } from '../core/types';
import { CvaExtractor } from '../extractors/CvaExtractor';
import { JsxAttributeExtractor } from '../extractors/JsxAttributeExtractor';
import { SvelteAttributeExtractor } from '../extractors/SvelteAttributeExtractor';
import { TailwindVariantsExtractor } from '../extractors/TailwindVariantsExtractor';
import { VueAttributeExtractor } from '../extractors/VueAttributeExtractor';
import { detectFramework, Framework } from '../utils/FrameworkDetector';

/**
 * OPTIMIZED: Service responsible for orchestrating class name extraction
 *
 * Performance improvements:
 * 1. Fast path for framework-specific elements (skip non-matching nodes early)
 * 2. Fast path for tv() calls (check only call expressions)
 * 3. Fast path for cva() calls (check only call expressions)
 * 4. Lazy initialization - only creates extractors when needed (memory efficient)
 * 5. Direct node type checking (faster than polymorphic calls)
 * 6. Reduced function call overhead
 * 7. Conditional extractor execution (skip disabled extractors)
 * 8. Framework detection per file (route to appropriate extractor)
 *
 * SOLID Principles:
 * - Single Responsibility: Only orchestrates extraction, doesn't own all extractors
 * - Open/Closed: Can add new frameworks without modifying constructor
 * - Dependency Inversion: Uses IClassNameExtractor interface
 */
export class ClassNameExtractionService {
	// Cache for framework extractors (lazy initialization)
	private frameworkExtractors = new Map<Framework, IClassNameExtractor>();

	// Variant extractors (always initialized as they work across all frameworks)
	private tvExtractor: TailwindVariantsExtractor | null;
	private cvaExtractor: CvaExtractor | null;

	constructor(
		private readonly enableTailwindVariants: boolean = true,
		private readonly enableClassVarianceAuthority: boolean = true
	) {
		// Only create variant extractors (they work across all frameworks)
		this.tvExtractor = enableTailwindVariants ? new TailwindVariantsExtractor() : null;
		this.cvaExtractor = enableClassVarianceAuthority ? new CvaExtractor() : null;
		// Framework-specific extractors are created on-demand via getFrameworkExtractor()
	}

	/**
	 * Factory method to create the appropriate extractor for a framework
	 * Follows Factory Pattern for object creation
	 */
	private createFrameworkExtractor(framework: Framework): IClassNameExtractor {
		switch (framework) {
			case Framework.JSX:
				return new JsxAttributeExtractor();
			case Framework.VUE:
				return new VueAttributeExtractor();
			case Framework.SVELTE:
				return new SvelteAttributeExtractor();
			default:
				throw new Error(`Unsupported framework: ${framework}`);
		}
	}

	/**
	 * Gets the extractor for a framework, creating it lazily if needed
	 * This ensures we only instantiate extractors we actually use
	 */
	private getFrameworkExtractor(framework: Framework): IClassNameExtractor {
		if (!this.frameworkExtractors.has(framework)) {
			this.frameworkExtractors.set(framework, this.createFrameworkExtractor(framework));
		}
		return this.frameworkExtractors.get(framework)!;
	}

	/**
	 * Extract all class names from a source file (OPTIMIZED)
	 */
	extractFromSourceFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilityFunctions: UtilityFunction[],
		typeChecker?: ts.TypeChecker
	): ClassNameInfo[] {
		const classNames: ClassNameInfo[] = [];

		// Detect framework from filename
		const framework = detectFramework(sourceFile.fileName);

		// Skip unsupported files
		if (!framework) {
			return classNames;
		}

		const context: ExtractionContext = {
			typescript,
			sourceFile,
			utilityFunctions,
			typeChecker,
			framework
		};

		// Get the appropriate extractor for this framework (lazy-loaded)
		const frameworkExtractor = this.getFrameworkExtractor(framework);

		// OPTIMIZATION: Direct node type checking in visit function
		// Avoids canHandle() overhead for every node
		const visit = (node: ts.Node): void => {
			// FAST PATH 1: Framework-specific extraction
			// For JSX, we can optimize by checking node type directly
			if (framework === Framework.JSX) {
				// Only process JSX opening/self-closing elements
				// This skips ~98% of nodes immediately
				if (typescript.isJsxOpeningElement(node) || typescript.isJsxSelfClosingElement(node)) {
					// Direct extraction without canHandle() check
					const extracted = frameworkExtractor.extract(node, context);
					if (extracted.length > 0) {
						classNames.push(...extracted);
					}
				}
			} else {
				// For Vue and Svelte, use canHandle() since we can't optimize with TS type guards
				// TODO: Optimize Vue/Svelte with direct node type checks when implementing
				if (frameworkExtractor.canHandle(node, context)) {
					const extracted = frameworkExtractor.extract(node, context);
					if (extracted.length > 0) {
						classNames.push(...extracted);
					}
				}
			}

			// FAST PATH 2: Check for variant library calls (tv, cva)
			// Only processes call expressions and only if extractors are enabled
			// These work across all frameworks
			if (typescript.isCallExpression(node)) {
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
