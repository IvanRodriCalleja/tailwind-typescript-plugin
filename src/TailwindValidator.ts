import fs from 'fs';
import path from 'path';

import { Logger } from './utils/Logger';

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
 */
export class TailwindValidator {
	private classSet: Set<string> | null = null;
	// @ts-expect-error
	private designSystem: DesignSystem;
	private cssFilePath: string;
	private logger: Logger;
	constructor(cssFilePath: string, logger: Logger) {
		this.cssFilePath = cssFilePath;
		this.logger = logger;
	}

	/**
	 * Load the design system and cache the class list
	 */
	async initialize(): Promise<void> {
		if (this.classSet !== null) {
			return; // Already initialized
		}

		this.logger.log(`[TailwindValidator] Loading design system from: ${this.cssFilePath}`);

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
					} catch (err) {
						this.logger.log(`[TailwindValidator] Failed to load stylesheet: ${err}`);
						return { base, content: '' };
					}
				},
				loadModule: async (id: string, base: string, resourceType: string) => {
					try {
						const resolvedPath = require.resolve(id, { paths: [base] });
						const module = require(resolvedPath);
						return { base: path.dirname(resolvedPath), module };
					} catch (err) {
						this.logger.log(`[TailwindValidator] Failed to load module: ${err}`);
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
			this.logger.log(`[TailwindValidator] Failed to load design system: ${error}`);
			throw error;
		}
	}

	isInitialized(): boolean {
		return this.classSet !== null;
	}

	/**
	 * Check if a class name is valid
	 * This handles both static classes and arbitrary values (e.g., w-[100px])
	 */
	isValidClass(className: string): boolean {
		if (!this.classSet || !this.designSystem) {
			this.logger.log('[TailwindValidator] Validator not initialized. Call initialize() first.');
			return true; // Assume valid if not initialized
		}

		// First, check if it's in the static class list (fast path)
		if (this.classSet.has(className)) {
			return true;
		}

		// If not in the static list, it might be an arbitrary value like w-[100px]
		// Use the design system to check if it generates valid CSS
		try {
			const result = this.designSystem.candidatesToCss([className]);
			// If candidatesToCss returns a non-null value, the class is valid
			return result[0] !== null;
		} catch (err) {
			this.logger.log(`[TailwindValidator] Failed to check class: ${err}`);
			// If there's an error, consider it invalid
			return false;
		}
	}

	/**
	 * Validate multiple class names and return invalid ones
	 */
	getInvalidClasses(classNames: string[]): string[] {
		if (!this.classSet) {
			return [];
		}

		return classNames.filter(className => !this.isValidClass(className));
	}

	/**
	 * Reload the design system (useful when CSS file changes)
	 */
	async reload(): Promise<void> {
		this.classSet = null;
		await this.initialize();
	}
}
