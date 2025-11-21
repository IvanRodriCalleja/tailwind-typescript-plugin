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

	constructor(
		config: IPluginConfig,
		private readonly logger: Logger
	) {
		this.utilityFunctions = this.initializeUtilityFunctions(config);
		this.cssFilePath = config.globalCss;
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

	getUtilityFunctions(): string[] {
		return this.utilityFunctions;
	}

	getCssFilePath(): string | undefined {
		return this.cssFilePath;
	}

	hasValidCssPath(): boolean {
		return this.cssFilePath !== undefined && this.cssFilePath.length > 0;
	}
}
