import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameExtractor, NodeFilterFn } from '../core/interfaces';
import { ClassNameInfo, ExtractionContext, UtilitiesConfig } from '../core/types';
import { CvaExtractor } from '../extractors/CvaExtractor';
import { JsxAttributeExtractor } from '../extractors/JsxAttributeExtractor';
import { TailwindVariantsExtractor } from '../extractors/TailwindVariantsExtractor';
import { VueAttributeExtractor } from '../extractors/VueAttributeExtractor';
import { Framework, detectFramework } from '../utils/FrameworkDetector';

/**
 * OPTIMIZED: Service responsible for orchestrating class name extraction
 *
 * Performance improvements:
 * 1. Fast path via extractor's getNodeFilter() (skips ~95-98% of nodes)
 * 2. Fast path for tv() calls (check only call expressions)
 * 3. Fast path for cva() calls (check only call expressions)
 * 4. Lazy initialization - only creates extractors when needed (memory efficient)
 * 5. Cached node filter functions (avoids repeated polymorphic calls)
 * 6. Reduced function call overhead
 * 7. Conditional extractor execution (skip disabled extractors)
 * 8. Framework detection per file (route to appropriate extractor)
 *
 * SOLID Principles:
 * - Single Responsibility: Only orchestrates extraction, doesn't own all extractors
 * - Open/Closed: Can add new frameworks without modifying this service
 * - Dependency Inversion: Uses IClassNameExtractor interface
 */
export class ClassNameExtractionService {
	// Cache for framework extractors (lazy initialization)
	private frameworkExtractors = new Map<Framework, IClassNameExtractor>();

	// Cache for node filter functions (avoids repeated getNodeFilter() calls)
	private nodeFilters = new Map<Framework, NodeFilterFn>();

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
			case Framework.ASTRO:
				return new JsxAttributeExtractor();
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
			const extractor = this.createFrameworkExtractor(framework);
			this.frameworkExtractors.set(framework, extractor);
			// Cache the node filter function to avoid repeated getNodeFilter() calls
			this.nodeFilters.set(framework, extractor.getNodeFilter());
		}
		return this.frameworkExtractors.get(framework)!;
	}

	/**
	 * Gets the cached node filter function for a framework
	 */
	private getNodeFilter(framework: Framework): NodeFilterFn {
		// Ensure extractor is created (which also caches the filter)
		this.getFrameworkExtractor(framework);
		return this.nodeFilters.get(framework)!;
	}

	/**
	 * Extract all class names from a source file (OPTIMIZED)
	 */
	extractFromSourceFile(
		typescript: typeof ts,
		sourceFile: ts.SourceFile,
		utilities: UtilitiesConfig,
		typeChecker?: ts.TypeChecker,
		classAttributes?: string[]
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
			utilities,
			typeChecker,
			framework,
			classAttributes
		};

		// Get the appropriate extractor for this framework (lazy-loaded)
		const frameworkExtractor = this.getFrameworkExtractor(framework);

		// Get the cached node filter function for fast pre-screening
		// Each extractor defines its own filter (JSX: ~98% skip, Vue: ~95% skip)
		const nodeFilter = this.getNodeFilter(framework);

		// OPTIMIZATION: Use cached filter function for fast node pre-screening
		// This avoids polymorphic canHandle() calls for ~95-98% of nodes
		const visit = (node: ts.Node): void => {
			// FAST PATH 1: Framework-specific extraction using extractor's filter
			// The filter is a cached function that each extractor defines
			if (nodeFilter(node, typescript)) {
				// Node passed the fast filter, now do the full canHandle check
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
