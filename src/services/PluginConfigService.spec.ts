import { PluginConfigService } from './PluginConfigService';

describe('PluginConfigService', () => {
	describe('classAttributes', () => {
		it('should return default class attributes when not configured', () => {
			const service = new PluginConfigService({});

			const classAttributes = service.getClassAttributes();

			expect(classAttributes).toContain('className');
			expect(classAttributes).toContain('class');
			expect(classAttributes).toContain('classList');
			expect(classAttributes).toHaveLength(3);
		});

		it('should merge user attributes with defaults', () => {
			const service = new PluginConfigService({
				classAttributes: ['colorStyles', 'textStyles']
			});

			const classAttributes = service.getClassAttributes();

			expect(classAttributes).toContain('className');
			expect(classAttributes).toContain('class');
			expect(classAttributes).toContain('classList');
			expect(classAttributes).toContain('colorStyles');
			expect(classAttributes).toContain('textStyles');
			expect(classAttributes).toHaveLength(5);
		});

		it('should deduplicate attributes when user provides defaults', () => {
			const service = new PluginConfigService({
				classAttributes: ['className', 'colorStyles', 'class']
			});

			const classAttributes = service.getClassAttributes();

			// Should not have duplicates
			const uniqueAttributes = [...new Set(classAttributes)];
			expect(classAttributes).toHaveLength(uniqueAttributes.length);

			// Should contain all expected attributes
			expect(classAttributes).toContain('className');
			expect(classAttributes).toContain('class');
			expect(classAttributes).toContain('classList');
			expect(classAttributes).toContain('colorStyles');
		});

		it('should handle empty user attributes array', () => {
			const service = new PluginConfigService({
				classAttributes: []
			});

			const classAttributes = service.getClassAttributes();

			expect(classAttributes).toContain('className');
			expect(classAttributes).toContain('class');
			expect(classAttributes).toContain('classList');
			expect(classAttributes).toHaveLength(3);
		});

		it('should preserve order with defaults first', () => {
			const service = new PluginConfigService({
				classAttributes: ['colorStyles']
			});

			const classAttributes = service.getClassAttributes();

			// Default attributes should come first
			expect(classAttributes[0]).toBe('className');
			expect(classAttributes[1]).toBe('class');
			expect(classAttributes[2]).toBe('classList');
			expect(classAttributes[3]).toBe('colorStyles');
		});
	});

	describe('other configurations', () => {
		it('should initialize with default utilities', () => {
			const service = new PluginConfigService({});

			const utilities = service.getUtilityFunctions();

			expect(utilities).toContainEqual('cn');
			expect(utilities).toContainEqual({ name: 'clsx', from: 'clsx' });
		});

		it('should enable variants by default', () => {
			const service = new PluginConfigService({});

			expect(service.isTailwindVariantsEnabled()).toBe(true);
			expect(service.isClassVarianceAuthorityEnabled()).toBe(true);
		});

		it('should enable validation by default', () => {
			const service = new PluginConfigService({});

			expect(service.isValidationEnabled()).toBe(true);
			expect(service.getValidationSeverity()).toBe('error');
		});

		it('should enable lint by default', () => {
			const service = new PluginConfigService({});

			expect(service.isLintEnabled()).toBe(true);
			expect(service.isConflictingClassesEnabled()).toBe(true);
			expect(service.isRepeatedClassesEnabled()).toBe(true);
		});

		it('should enable editor features by default', () => {
			const service = new PluginConfigService({});

			expect(service.isEditorEnabled()).toBe(true);
			expect(service.isAutocompleteEnabled()).toBe(true);
			expect(service.isHoverEnabled()).toBe(true);
		});
	});
});
