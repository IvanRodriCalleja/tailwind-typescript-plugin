import { IPluginConfig } from '../core/interfaces';
import {
	DiagnosticSeverity,
	EditorConfig,
	LintConfig,
	UtilitiesConfig,
	UtilityFunction,
	ValidationConfig,
	VariantsConfig
} from '../core/types';

/**
 * Default utilities configuration
 * Key is function name, value is import source ("*" = any source, "off" = disabled)
 */
const DEFAULT_UTILITIES: UtilitiesConfig = {
	cn: '*', // Custom wrapper pattern (e.g., shadcn), any source
	clsx: 'clsx',
	classnames: 'classnames',
	classNames: 'classnames',
	cx: 'classnames',
	twMerge: 'tailwind-merge'
};

/**
 * Default variants configuration
 */
const DEFAULT_VARIANTS: VariantsConfig = {
	tailwindVariants: true,
	classVarianceAuthority: true
};

/**
 * Default validation configuration
 */
const DEFAULT_VALIDATION: Required<Omit<ValidationConfig, 'allowedClasses'>> & {
	allowedClasses: string[];
} = {
	enabled: true,
	severity: 'error',
	allowedClasses: []
};

/**
 * Default lint configuration
 */
const DEFAULT_LINT: LintConfig = {
	enabled: true,
	conflictingClasses: {
		enabled: true,
		severity: 'warning'
	},
	repeatedClasses: {
		enabled: true,
		severity: 'warning'
	}
};

/**
 * Default editor configuration
 */
const DEFAULT_EDITOR: EditorConfig = {
	enabled: true,
	autocomplete: {
		enabled: true
	},
	hover: {
		enabled: true
	}
};

/**
 * Service responsible for managing plugin configuration
 * Follows Single Responsibility Principle
 */
export class PluginConfigService {
	private utilitiesConfig: UtilitiesConfig;
	private variantsConfig: VariantsConfig;
	private validationConfig: Required<Omit<ValidationConfig, 'allowedClasses'>> & {
		allowedClasses: string[];
	};
	private lintConfig: LintConfig;
	private editorConfig: EditorConfig;
	private cssFilePath?: string;

	// Legacy format support (for internal use by extractors)
	private utilityFunctionsLegacy: UtilityFunction[];

	constructor(config: IPluginConfig) {
		this.cssFilePath = config.globalCss;

		// Initialize configuration with backwards compatibility
		this.utilitiesConfig = this.initializeUtilities(config);
		this.variantsConfig = this.initializeVariants(config);
		this.validationConfig = this.initializeValidation(config);
		this.lintConfig = this.initializeLint(config);
		this.editorConfig = this.initializeEditor(config);

		// Convert to legacy format for extractors
		this.utilityFunctionsLegacy = this.convertToLegacyFormat(this.utilitiesConfig);
	}

	private initializeUtilities(config: IPluginConfig): UtilitiesConfig {
		if (config.libraries?.utilities) {
			// Merge with defaults (user config overrides defaults)
			return { ...DEFAULT_UTILITIES, ...config.libraries.utilities };
		}

		return { ...DEFAULT_UTILITIES };
	}

	private initializeVariants(config: IPluginConfig): VariantsConfig {
		if (config.libraries?.variants) {
			const userVariants = config.libraries.variants;
			const hasAnyConfig =
				userVariants.tailwindVariants !== undefined ||
				userVariants.classVarianceAuthority !== undefined;

			if (hasAnyConfig) {
				// User specified at least one - only enable those explicitly set to true
				return {
					tailwindVariants: userVariants.tailwindVariants === true,
					classVarianceAuthority: userVariants.classVarianceAuthority === true
				};
			}
		}

		return { ...DEFAULT_VARIANTS };
	}

	private initializeValidation(config: IPluginConfig): Required<Omit<ValidationConfig, 'allowedClasses'>> & {
		allowedClasses: string[];
	} {
		const validation = config.validation || {};

		return {
			enabled: validation.enabled !== false, // default true
			severity: validation.severity || DEFAULT_VALIDATION.severity,
			allowedClasses: validation.allowedClasses || []
		};
	}

	private initializeLint(config: IPluginConfig): LintConfig {
		const lint = config.lint || {};

		return {
			enabled: lint.enabled !== false, // default true
			conflictingClasses: {
				enabled: lint.conflictingClasses?.enabled !== false, // default true
				severity: lint.conflictingClasses?.severity || DEFAULT_LINT.conflictingClasses!.severity
			},
			repeatedClasses: {
				enabled: lint.repeatedClasses?.enabled !== false, // default true
				severity: lint.repeatedClasses?.severity || DEFAULT_LINT.repeatedClasses!.severity
			}
		};
	}

	private initializeEditor(config: IPluginConfig): EditorConfig {
		const editor = config.editor || {};

		return {
			enabled: editor.enabled !== false, // default true
			autocomplete: {
				enabled: editor.autocomplete?.enabled !== false // default true
			},
			hover: {
				enabled: editor.hover?.enabled !== false // default true
			}
		};
	}

	/**
	 * Convert new utilities config to legacy UtilityFunction[] format
	 * This is needed for backwards compatibility with extractors
	 */
	private convertToLegacyFormat(utilities: UtilitiesConfig): UtilityFunction[] {
		const result: UtilityFunction[] = [];

		for (const [name, source] of Object.entries(utilities)) {
			if (source === 'off') {
				continue; // Skip disabled utilities
			}
			if (source === '*') {
				result.push(name); // Simple string = any source
			} else {
				result.push({ name, from: source });
			}
		}

		return result;
	}

	// ---- Getters for utilities ----

	getUtilitiesConfig(): UtilitiesConfig {
		return this.utilitiesConfig;
	}

	/**
	 * Get utility functions in legacy format (for extractors)
	 */
	getUtilityFunctions(): UtilityFunction[] {
		return this.utilityFunctionsLegacy;
	}

	// ---- Getters for variants ----

	getVariantsConfig(): VariantsConfig {
		return this.variantsConfig;
	}

	isTailwindVariantsEnabled(): boolean {
		return this.variantsConfig.tailwindVariants === true;
	}

	isClassVarianceAuthorityEnabled(): boolean {
		return this.variantsConfig.classVarianceAuthority === true;
	}

	// ---- Getters for validation ----

	getValidationConfig(): ValidationConfig {
		return this.validationConfig;
	}

	isValidationEnabled(): boolean {
		return this.validationConfig.enabled;
	}

	getValidationSeverity(): DiagnosticSeverity {
		return this.validationConfig.severity;
	}

	getAllowedClasses(): string[] {
		return this.validationConfig.allowedClasses;
	}

	// ---- Getters for lint ----

	getLintConfig(): LintConfig {
		return this.lintConfig;
	}

	isLintEnabled(): boolean {
		return this.lintConfig.enabled !== false;
	}

	isConflictingClassesEnabled(): boolean {
		return this.isLintEnabled() && this.lintConfig.conflictingClasses?.enabled !== false;
	}

	getConflictingClassesSeverity(): DiagnosticSeverity {
		return this.lintConfig.conflictingClasses?.severity || 'warning';
	}

	isRepeatedClassesEnabled(): boolean {
		return this.isLintEnabled() && this.lintConfig.repeatedClasses?.enabled !== false;
	}

	getRepeatedClassesSeverity(): DiagnosticSeverity {
		return this.lintConfig.repeatedClasses?.severity || 'warning';
	}

	// ---- Getters for editor ----

	getEditorConfig(): EditorConfig {
		return this.editorConfig;
	}

	isEditorEnabled(): boolean {
		return this.editorConfig.enabled !== false;
	}

	isAutocompleteEnabled(): boolean {
		return this.isEditorEnabled() && this.editorConfig.autocomplete?.enabled !== false;
	}

	isHoverEnabled(): boolean {
		return this.isEditorEnabled() && this.editorConfig.hover?.enabled !== false;
	}

	// ---- Getters for global settings ----

	getCssFilePath(): string | undefined {
		return this.cssFilePath;
	}

	hasValidCssPath(): boolean {
		return this.cssFilePath !== undefined && this.cssFilePath.length > 0;
	}
}
