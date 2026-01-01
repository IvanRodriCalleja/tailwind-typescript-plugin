import { ConfigSchemaValidator } from './ConfigSchemaValidator';

describe('ConfigSchemaValidator', () => {
	let validator: ConfigSchemaValidator;

	beforeEach(() => {
		validator = new ConfigSchemaValidator();
	});

	describe('valid configurations', () => {
		it('should accept empty configuration', () => {
			const result = validator.validate({});

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept null configuration', () => {
			const result = validator.validate(null);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept undefined configuration', () => {
			const result = validator.validate(undefined);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept valid minimal configuration', () => {
			const result = validator.validate({
				globalCss: './src/globals.css'
			});

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept valid full configuration', () => {
			const result = validator.validate({
				globalCss: './src/globals.css',
				libraries: {
					utilities: {
						cn: '*',
						clsx: 'clsx',
						myUtil: '@/lib/utils'
					},
					variants: {
						tailwindVariants: true,
						classVarianceAuthority: false
					}
				},
				validation: {
					enabled: true,
					severity: 'error',
					allowedClasses: ['custom-*', '*-icon']
				},
				lint: {
					enabled: true,
					conflictingClasses: {
						enabled: true,
						severity: 'warning'
					},
					repeatedClasses: {
						enabled: false,
						severity: 'suggestion'
					}
				},
				editor: {
					enabled: true,
					autocomplete: {
						enabled: true
					},
					hover: {
						enabled: false
					}
				},
				classAttributes: ['containerStyles', 'textStyles']
			});

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept all valid severity values', () => {
			const severities = ['error', 'warning', 'suggestion', 'off'];

			for (const severity of severities) {
				const result = validator.validate({
					validation: { severity }
				});

				expect(result.valid).toBe(true);
				expect(result.errors).toHaveLength(0);
			}
		});
	});

	describe('invalid root configuration', () => {
		it('should reject non-object configuration', () => {
			const result = validator.validate('invalid');

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should reject array configuration', () => {
			const result = validator.validate([]);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe('unknown properties', () => {
		it('should reject unknown root properties', () => {
			const result = validator.validate({
				globalCss: './src/globals.css',
				unknownProp: true
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].message).toContain('unknownProp');
		});

		it('should reject unknown nested properties in libraries', () => {
			const result = validator.validate({
				libraries: {
					unknownProp: true
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain('unknownProp');
		});

		it('should reject unknown nested properties in validation', () => {
			const result = validator.validate({
				validation: {
					unknownProp: true
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain('unknownProp');
		});
	});

	describe('invalid types', () => {
		it('should reject invalid globalCss type', () => {
			const result = validator.validate({
				globalCss: 123
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].path).toBe('globalCss');
			expect(result.errors[0].message).toContain('Expected string');
		});

		it('should reject invalid libraries type', () => {
			const result = validator.validate({
				libraries: 'invalid'
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('libraries');
		});

		it('should reject invalid validation.enabled type', () => {
			const result = validator.validate({
				validation: {
					enabled: 'true'
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('validation.enabled');
			expect(result.errors[0].message).toContain('Expected boolean');
		});

		it('should reject invalid classAttributes type', () => {
			const result = validator.validate({
				classAttributes: 'className'
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('classAttributes');
		});

		it('should reject invalid items in classAttributes array', () => {
			const result = validator.validate({
				classAttributes: ['valid', 123, 'alsoValid']
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].path).toBe('classAttributes.1');
		});
	});

	describe('invalid enum values', () => {
		it('should reject invalid severity value', () => {
			const result = validator.validate({
				validation: {
					severity: 'invalid'
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('validation.severity');
			expect(result.errors[0].message).toContain('Must be one of');
		});

		it('should reject invalid lint severity', () => {
			const result = validator.validate({
				lint: {
					conflictingClasses: {
						severity: 'critical'
					}
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('lint.conflictingClasses.severity');
		});
	});

	describe('nested object validation', () => {
		it('should validate nested libraries.variants', () => {
			const result = validator.validate({
				libraries: {
					variants: {
						tailwindVariants: 'true'
					}
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('libraries.variants.tailwindVariants');
		});

		it('should validate nested lint rules', () => {
			const result = validator.validate({
				lint: {
					repeatedClasses: {
						enabled: 1
					}
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('lint.repeatedClasses.enabled');
		});

		it('should validate deeply nested editor config', () => {
			const result = validator.validate({
				editor: {
					autocomplete: {
						enabled: []
					}
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('editor.autocomplete.enabled');
		});
	});

	describe('libraries.utilities validation', () => {
		it('should accept valid utilities config', () => {
			const result = validator.validate({
				libraries: {
					utilities: {
						cn: '*',
						clsx: 'clsx',
						myHelper: '@/lib/utils',
						disabled: 'off'
					}
				}
			});

			expect(result.valid).toBe(true);
		});

		it('should reject non-string utility values', () => {
			const result = validator.validate({
				libraries: {
					utilities: {
						cn: true
					}
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('libraries.utilities.cn');
		});
	});

	describe('validation.allowedClasses validation', () => {
		it('should accept valid allowedClasses patterns', () => {
			const result = validator.validate({
				validation: {
					allowedClasses: ['custom-*', '*-icon', '*-card-*', 'exact-match']
				}
			});

			expect(result.valid).toBe(true);
		});

		it('should reject non-string items in allowedClasses', () => {
			const result = validator.validate({
				validation: {
					allowedClasses: [123]
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors[0].path).toBe('validation.allowedClasses.0');
		});
	});

	describe('multiple errors', () => {
		it('should collect multiple errors', () => {
			const result = validator.validate({
				globalCss: 123,
				validation: {
					enabled: 'yes',
					severity: 'critical'
				}
			});

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('formatErrors', () => {
		it('should format errors as human-readable messages', () => {
			const result = validator.validate({
				globalCss: 123
			});

			const formatted = validator.formatErrors(result.errors);

			expect(formatted).toHaveLength(1);
			expect(formatted[0]).toContain('Configuration error at "globalCss"');
		});

		it('should return empty array for no errors', () => {
			const result = validator.validate({});
			const formatted = validator.formatErrors(result.errors);

			expect(formatted).toHaveLength(0);
		});
	});

	describe('getErrorSummary', () => {
		it('should return formatted summary with all errors', () => {
			const result = validator.validate({
				globalCss: 123,
				unknownProp: true
			});

			const summary = validator.getErrorSummary(result.errors);

			expect(summary).toContain('Tailwind TypeScript Plugin: Invalid configuration found:');
		});

		it('should return empty string for valid config', () => {
			const result = validator.validate({});
			const summary = validator.getErrorSummary(result.errors);

			expect(summary).toBe('');
		});
	});

	describe('edge cases', () => {
		it('should handle empty nested objects', () => {
			const result = validator.validate({
				libraries: {},
				validation: {},
				lint: {},
				editor: {}
			});

			expect(result.valid).toBe(true);
		});

		it('should handle empty arrays', () => {
			const result = validator.validate({
				classAttributes: [],
				validation: {
					allowedClasses: []
				}
			});

			expect(result.valid).toBe(true);
		});

		it('should reject null values for objects', () => {
			const result = validator.validate({
				libraries: null
			});

			expect(result.valid).toBe(false);
		});
	});
});
