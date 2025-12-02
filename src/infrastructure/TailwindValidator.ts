import fs from 'fs';
import path from 'path';

import { IClassNameValidator } from '../core/interfaces';
import { PerformanceCache } from '../services/PerformanceCache';

type Tailwind = {
	__unstable__loadDesignSystem: (
		css: string,
		options: {
			base: string;
			loadStylesheet: (id: string, base: string) => Promise<{ base: string; content: string }>;
			loadModule: (
				id: string,
				base: string,
				resourceType: string
			) => Promise<{ base: string; module: unknown }>;
		}
	) => Promise<DesignSystem>;
};

type DesignSystem = {
	getClassList: () => [string, unknown][];
	candidatesToCss: (classNames: string[]) => string[];
};

/**
 * Class validator for Tailwind CSS v4
 * This loads the design system once and caches it for validation
 * Implements IClassNameValidator for dependency inversion
 */
export class TailwindValidator implements IClassNameValidator {
	private classSet: Set<string> | null = null;
	// @ts-expect-error
	private designSystem: DesignSystem;
	private cssFilePath: string;
	private validationCache: PerformanceCache<string, boolean>;
	private allowedClasses: Set<string> = new Set();
	private allowedPatterns: Array<{ pattern: string; type: 'prefix' | 'suffix' | 'contains' }> = [];

	constructor(cssFilePath: string) {
		this.cssFilePath = cssFilePath;
		this.validationCache = new PerformanceCache<string, boolean>(2000);
	}

	/**
	 * Load the design system and cache the class list
	 */
	async initialize(): Promise<void> {
		if (this.classSet !== null) {
			return; // Already initialized
		}

		try {
			// Load the design system with full API access
			const tailwindcss = require('tailwindcss') as Tailwind;

			if (!tailwindcss.__unstable__loadDesignSystem) {
				throw new Error('Tailwind CSS v4 with __unstable__loadDesignSystem API is required');
			}

			const css = fs.readFileSync(this.cssFilePath, 'utf-8');

			this.designSystem = await tailwindcss.__unstable__loadDesignSystem(css, {
				base: path.dirname(this.cssFilePath),
				loadStylesheet: async (id: string, base: string) => {
					try {
						if (id === 'tailwindcss' || id === 'tailwindcss/theme.css') {
							const tailwindPackagePath = require.resolve('tailwindcss/package.json');
							const tailwindDir = path.dirname(tailwindPackagePath);
							const themePath = path.join(tailwindDir, 'theme.css');
							return {
								base: tailwindDir,
								content: fs.readFileSync(themePath, 'utf-8')
							};
						}
						const resolvedPath = path.resolve(base, id);
						return {
							base: path.dirname(resolvedPath),
							content: fs.readFileSync(resolvedPath, 'utf-8')
						};
					} catch {
						return { base, content: '' };
					}
				},
				loadModule: async (id: string, base: string, resourceType: string) => {
					try {
						const resolvedPath = require.resolve(id, { paths: [base] });
						const module = require(resolvedPath);
						return { base: path.dirname(resolvedPath), module };
					} catch {
						if (resourceType === 'config') {
							return { base, module: {} };
						} else if (resourceType === 'plugin') {
							return { base, module: () => {} };
						}
						return { base, module: null };
					}
				}
			});

			this.classSet = new Set(this.designSystem.getClassList().map(([className]) => className));
		} catch (error) {
			throw error;
		}
	}

	isInitialized(): boolean {
		return this.classSet !== null;
	}

	/**
	 * Set custom allowed classes from configuration
	 * Supports exact matches and wildcard patterns:
	 * - "custom-*" matches anything starting with "custom-"
	 * - "*-icon" matches anything ending with "-icon"
	 * - "*-component-*" matches anything containing "-component-"
	 */
	setAllowedClasses(allowedClasses: string[]): void {
		const exactClasses: string[] = [];
		const patterns: Array<{ pattern: string; type: 'prefix' | 'suffix' | 'contains' }> = [];

		for (const entry of allowedClasses) {
			const startsWithWildcard = entry.startsWith('*');
			const endsWithWildcard = entry.endsWith('*');

			if (startsWithWildcard && endsWithWildcard && entry.length > 2) {
				// *something* -> contains match
				patterns.push({ pattern: entry.slice(1, -1), type: 'contains' });
			} else if (endsWithWildcard && entry.length > 1) {
				// something* -> prefix match
				patterns.push({ pattern: entry.slice(0, -1), type: 'prefix' });
			} else if (startsWithWildcard && entry.length > 1) {
				// *something -> suffix match
				patterns.push({ pattern: entry.slice(1), type: 'suffix' });
			} else {
				// Exact match (including lone "*" which we treat as exact)
				exactClasses.push(entry);
			}
		}

		this.allowedClasses = new Set(exactClasses);
		this.allowedPatterns = patterns;

		// Clear cache when allowed classes change
		this.validationCache.clear();
	}

	/**
	 * Check if a class name matches any allowed pattern
	 */
	private matchesAllowedPattern(className: string): boolean {
		for (const { pattern, type } of this.allowedPatterns) {
			switch (type) {
				case 'prefix':
					if (className.startsWith(pattern)) return true;
					break;
				case 'suffix':
					if (className.endsWith(pattern)) return true;
					break;
				case 'contains':
					if (className.includes(pattern)) return true;
					break;
			}
		}
		return false;
	}

	/**
	 * Check if a class name is valid
	 * This handles both static classes and arbitrary values (e.g., w-[100px])
	 * PERFORMANCE OPTIMIZED: Reduced logging, faster cache checks
	 */
	isValidClass(className: string): boolean {
		if (!this.classSet || !this.designSystem) {
			return true; // Assume valid if not initialized
		}

		// PERFORMANCE: Check cache first (fastest path)
		const cached = this.validationCache.get(className);
		if (cached !== undefined) {
			return cached;
		}

		// PERFORMANCE: Check custom allowed classes (fast path - exact match)
		if (this.allowedClasses.has(className)) {
			this.validationCache.set(className, true);
			return true;
		}

		// Check allowed patterns (slightly slower path)
		if (this.allowedPatterns.length > 0 && this.matchesAllowedPattern(className)) {
			this.validationCache.set(className, true);
			return true;
		}

		// PERFORMANCE: Check static class list (fast path)
		if (this.classSet.has(className)) {
			this.validationCache.set(className, true);
			return true;
		}

		// Arbitrary value validation (slower path)
		// Use the design system to check if it generates valid CSS
		try {
			const result = this.designSystem.candidatesToCss([className]);
			const isValid = result[0] !== null;
			this.validationCache.set(className, isValid);
			return isValid;
		} catch {
			this.validationCache.set(className, false);
			return false;
		}
	}

	/**
	 * Validate multiple class names and return invalid ones
	 * PERFORMANCE OPTIMIZED: Batch validation for arbitrary values
	 */
	getInvalidClasses(classNames: string[]): string[] {
		if (!this.classSet || !this.designSystem) {
			return [];
		}

		// PERFORMANCE: Separate classes into categories for efficient batch processing
		const invalidClasses: string[] = [];
		const uncachedArbitraryValues: string[] = [];

		for (const className of classNames) {
			// Check cache first
			const cached = this.validationCache.get(className);
			if (cached !== undefined) {
				if (!cached) {
					invalidClasses.push(className);
				}
				continue;
			}

			// Check allowed classes (exact match)
			if (this.allowedClasses.has(className)) {
				this.validationCache.set(className, true);
				continue;
			}

			// Check allowed patterns
			if (this.allowedPatterns.length > 0 && this.matchesAllowedPattern(className)) {
				this.validationCache.set(className, true);
				continue;
			}

			// Check static class list
			if (this.classSet.has(className)) {
				this.validationCache.set(className, true);
				continue;
			}

			// Needs arbitrary value validation
			uncachedArbitraryValues.push(className);
		}

		// PERFORMANCE: Batch validate arbitrary values if any exist
		if (uncachedArbitraryValues.length > 0) {
			try {
				const results = this.designSystem.candidatesToCss(uncachedArbitraryValues);
				for (let i = 0; i < uncachedArbitraryValues.length; i++) {
					const className = uncachedArbitraryValues[i];
					const isValid = results[i] !== null;
					this.validationCache.set(className, isValid);
					if (!isValid) {
						invalidClasses.push(className);
					}
				}
			} catch {
				// On error, mark all as invalid
				for (const className of uncachedArbitraryValues) {
					this.validationCache.set(className, false);
					invalidClasses.push(className);
				}
			}
		}

		return invalidClasses;
	}

	/**
	 * Reload the design system (useful when CSS file changes)
	 */
	async reload(): Promise<void> {
		this.classSet = null;
		this.validationCache.clear();
		await this.initialize();
	}

	/**
	 * Get cache statistics (for performance monitoring)
	 */
	getCacheStats(): { size: number; maxSize: number } {
		return {
			size: this.validationCache.size,
			maxSize: 2000
		};
	}

	/**
	 * Get similar class names for a given invalid class (for "Did you mean?" suggestions)
	 * Uses Levenshtein distance to find closest matches
	 */
	getSimilarClasses(invalidClass: string, maxSuggestions: number = 3): string[] {
		if (!this.classSet) {
			return [];
		}

		// Calculate similarity scores for all classes
		const scored: Array<{ className: string; distance: number }> = [];

		for (const validClass of this.classSet) {
			const distance = this.levenshteinDistance(invalidClass, validClass);
			// Only consider classes with reasonable similarity (distance less than half the length)
			const maxDistance = Math.max(invalidClass.length, validClass.length) * 0.6;
			if (distance <= maxDistance) {
				scored.push({ className: validClass, distance });
			}
		}

		// Sort by distance (closest first) and return top suggestions
		return scored
			.sort((a, b) => a.distance - b.distance)
			.slice(0, maxSuggestions)
			.map(s => s.className);
	}

	/**
	 * Calculate Levenshtein distance between two strings
	 * This measures the minimum number of single-character edits needed to transform one string into another
	 */
	private levenshteinDistance(a: string, b: string): number {
		const matrix: number[][] = [];

		// Initialize first column
		for (let i = 0; i <= a.length; i++) {
			matrix[i] = [i];
		}

		// Initialize first row
		for (let j = 0; j <= b.length; j++) {
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for (let i = 1; i <= a.length; i++) {
			for (let j = 1; j <= b.length; j++) {
				const cost = a[i - 1] === b[j - 1] ? 0 : 1;
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1, // deletion
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j - 1] + cost // substitution
				);
			}
		}

		return matrix[a.length][b.length];
	}

	/**
	 * Get all valid class names (for completions or other purposes)
	 */
	getAllClasses(): string[] {
		if (!this.classSet) {
			return [];
		}
		return Array.from(this.classSet);
	}

	/**
	 * Get the generated CSS for a list of class names.
	 * Uses Tailwind's candidatesToCss to generate the actual CSS output.
	 * Returns an array of CSS strings (or null for invalid classes) in the same order as input.
	 */
	getCssForClasses(classNames: string[]): (string | null)[] {
		if (!this.designSystem) {
			return classNames.map(() => null);
		}

		try {
			return this.designSystem.candidatesToCss(classNames);
		} catch {
			return classNames.map(() => null);
		}
	}
}
