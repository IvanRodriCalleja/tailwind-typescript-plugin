import { IPluginConfig } from '../core/interfaces';
import { Logger } from '../utils/Logger';

/**
 * Default utility functions to validate
 */
const DEFAULT_UTILITY_FUNCTIONS = [
	'clsx',
	'cn',
	'classnames',
	'classNames',
	'cx',
	'cva',
	'twMerge',
	'tv'
];

/**
 * Service responsible for managing plugin configuration
 * Follows Single Responsibility Principle
 */
export class PluginConfigService {
	private utilityFunctions: string[];
	private cssFilePath?: string;
	private tailwindVariantsEnabled: boolean;
	private classVarianceAuthorityEnabled: boolean;
	private allowedClasses: string[];
	private loggingEnabled: boolean;

	constructor(
		config: IPluginConfig,
		private readonly logger: Logger
	) {
		this.loggingEnabled = config.enableLogging === true;
		this.utilityFunctions = this.initializeUtilityFunctions(config);
		this.cssFilePath = config.globalCss;
		this.allowedClasses = this.initializeAllowedClasses(config);

		// If ANY variant config is defined, only enable those explicitly set to true
		// If NO variant config is defined, enable both by default
		const variantsConfig = config.variants;
		const hasAnyVariantConfig =
			variantsConfig &&
			(variantsConfig.tailwindVariants !== undefined ||
				variantsConfig.classVarianceAuthority !== undefined);

		if (hasAnyVariantConfig) {
			// User specified at least one variant - only enable those explicitly set to true
			this.tailwindVariantsEnabled = variantsConfig.tailwindVariants === true;
			this.classVarianceAuthorityEnabled = variantsConfig.classVarianceAuthority === true;
		} else {
			// No variants configured - enable both by default
			this.tailwindVariantsEnabled = true;
			this.classVarianceAuthorityEnabled = true;
		}

		this.logExtractorConfig();
	}

	private initializeUtilityFunctions(config: IPluginConfig): string[] {
		if (config.utilityFunctions && Array.isArray(config.utilityFunctions)) {
			// Merge user-provided functions with defaults (remove duplicates)
			const merged = [...new Set([...DEFAULT_UTILITY_FUNCTIONS, ...config.utilityFunctions])];
			this.logger.log(`Using utility functions (defaults + custom): ${merged.join(', ')}`);
			return merged;
		} else {
			this.logger.log(`Using default utility functions: ${DEFAULT_UTILITY_FUNCTIONS.join(', ')}`);
			return DEFAULT_UTILITY_FUNCTIONS;
		}
	}

	private initializeAllowedClasses(config: IPluginConfig): string[] {
		if (config.allowedClasses && Array.isArray(config.allowedClasses)) {
			this.logger.log(`Custom allowed classes: ${config.allowedClasses.join(', ')}`);
			return config.allowedClasses;
		} else {
			return [];
		}
	}

	getUtilityFunctions(): string[] {
		return this.utilityFunctions;
	}

	getCssFilePath(): string | undefined {
		return this.cssFilePath;
	}

	hasValidCssPath(): boolean {
		return this.cssFilePath !== undefined && this.cssFilePath.length > 0;
	}

	isTailwindVariantsEnabled(): boolean {
		return this.tailwindVariantsEnabled;
	}

	isClassVarianceAuthorityEnabled(): boolean {
		return this.classVarianceAuthorityEnabled;
	}

	getAllowedClasses(): string[] {
		return this.allowedClasses;
	}

	isLoggingEnabled(): boolean {
		return this.loggingEnabled;
	}

	private logExtractorConfig(): void {
		const enabled: string[] = [];
		if (this.tailwindVariantsEnabled) enabled.push('tailwind-variants');
		if (this.classVarianceAuthorityEnabled) enabled.push('class-variance-authority');

		if (enabled.length === 0) {
			this.logger.log('⚠️  No variant library extractors enabled');
		} else {
			this.logger.log(`✓ Enabled variant extractors: ${enabled.join(', ')}`);
		}
	}
}
