import { z } from 'zod';

/**
 * Configuration validation error
 */
export interface ConfigValidationError {
	path: string;
	message: string;
	code?: string;
}

/**
 * Result of configuration validation
 */
export interface ConfigValidationResult {
	valid: boolean;
	errors: ConfigValidationError[];
}

/**
 * Diagnostic severity levels
 */
const DiagnosticSeveritySchema = z.enum(['error', 'warning', 'suggestion', 'off']);

/**
 * Lint rule configuration schema
 */
const LintRuleConfigSchema = z
	.object({
		enabled: z.boolean().optional(),
		severity: DiagnosticSeveritySchema.optional()
	})
	.strict();

/**
 * Zod schema for plugin configuration
 */
const PluginConfigSchema = z
	.object({
		globalCss: z.string().optional(),

		libraries: z
			.object({
				utilities: z.record(z.string(), z.string()).optional(),
				variants: z
					.object({
						tailwindVariants: z.boolean().optional(),
						classVarianceAuthority: z.boolean().optional()
					})
					.strict()
					.optional()
			})
			.strict()
			.optional(),

		validation: z
			.object({
				enabled: z.boolean().optional(),
				severity: DiagnosticSeveritySchema.optional(),
				allowedClasses: z.array(z.string()).optional()
			})
			.strict()
			.optional(),

		lint: z
			.object({
				enabled: z.boolean().optional(),
				conflictingClasses: LintRuleConfigSchema.optional(),
				repeatedClasses: LintRuleConfigSchema.optional()
			})
			.strict()
			.optional(),

		editor: z
			.object({
				enabled: z.boolean().optional(),
				autocomplete: z
					.object({
						enabled: z.boolean().optional()
					})
					.strict()
					.optional(),
				hover: z
					.object({
						enabled: z.boolean().optional()
					})
					.strict()
					.optional()
			})
			.strict()
			.optional(),

		classAttributes: z.array(z.string()).optional()
	})
	.strict();

/**
 * Service for validating plugin configuration against the expected schema.
 * Uses Zod for schema validation with helpful error messages.
 */
export class ConfigSchemaValidator {
	/**
	 * Validate the plugin configuration
	 * @param config The configuration object to validate
	 * @returns Validation result with any errors found
	 */
	validate(config: unknown): ConfigValidationResult {
		if (config === null || config === undefined) {
			return { valid: true, errors: [] };
		}

		const result = PluginConfigSchema.safeParse(config);

		if (result.success) {
			return { valid: true, errors: [] };
		}

		const errors: ConfigValidationError[] = result.error.issues.map(issue => {
			const path = issue.path.join('.');
			const message = this.formatZodMessage(issue);

			return {
				path,
				message,
				code: issue.code
			};
		});

		return { valid: false, errors };
	}

	/**
	 * Format Zod error message to be more user-friendly
	 */
	private formatZodMessage(issue: z.ZodIssue): string {
		switch (issue.code) {
			case 'invalid_type':
				return `Expected ${issue.expected}, got ${issue.received}`;
			case 'invalid_enum_value':
				return `Invalid value. Must be one of: ${issue.options.map(o => `"${o}"`).join(', ')}`;
			case 'unrecognized_keys':
				return `Unknown property: "${issue.keys.join('", "')}"`;
			default:
				return issue.message;
		}
	}

	/**
	 * Format validation errors into human-readable messages
	 */
	formatErrors(errors: ConfigValidationError[]): string[] {
		return errors.map(error => {
			const location = error.path ? `at "${error.path}"` : 'at root';
			return `Configuration error ${location}: ${error.message}`;
		});
	}

	/**
	 * Get a summary of all validation errors
	 */
	getErrorSummary(errors: ConfigValidationError[]): string {
		if (errors.length === 0) {
			return '';
		}

		const formatted = this.formatErrors(errors);
		return `Tailwind TypeScript Plugin: Invalid configuration found:\n${formatted.map(e => `  - ${e}`).join('\n')}`;
	}
}
