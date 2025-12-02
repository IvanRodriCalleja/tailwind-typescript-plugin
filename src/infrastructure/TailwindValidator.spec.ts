import fs from 'fs';
import os from 'os';
import path from 'path';

import { TailwindValidator } from './TailwindValidator';

describe('TailwindValidator', () => {
	let validator: TailwindValidator;
	let tempCssFile: string;

	beforeAll(async () => {
		// Create a temporary CSS file for testing
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-test-'));
		tempCssFile = path.join(tempDir, 'global.css');
		fs.writeFileSync(tempCssFile, '@import "tailwindcss";');

		validator = new TailwindValidator(tempCssFile);
		await validator.initialize();
	});

	describe('initialization', () => {
		it('should initialize successfully', () => {
			expect(validator.isInitialized()).toBe(true);
		});

		it('should not re-initialize if already initialized', async () => {
			const beforeInit = validator.isInitialized();
			await validator.initialize();
			const afterInit = validator.isInitialized();
			expect(beforeInit).toBe(afterInit);
		});
	});

	describe('isValidClass', () => {
		describe('standard Tailwind classes', () => {
			it('should validate basic utility classes', () => {
				expect(validator.isValidClass('flex')).toBe(true);
				expect(validator.isValidClass('block')).toBe(true);
				expect(validator.isValidClass('hidden')).toBe(true);
				expect(validator.isValidClass('container')).toBe(true);
			});

			it('should validate spacing utilities', () => {
				expect(validator.isValidClass('p-4')).toBe(true);
				expect(validator.isValidClass('m-8')).toBe(true);
				expect(validator.isValidClass('mx-auto')).toBe(true);
				expect(validator.isValidClass('py-2')).toBe(true);
			});

			it('should validate color utilities', () => {
				expect(validator.isValidClass('bg-blue-500')).toBe(true);
				expect(validator.isValidClass('text-red-600')).toBe(true);
				expect(validator.isValidClass('border-gray-300')).toBe(true);
			});

			it('should validate typography utilities', () => {
				expect(validator.isValidClass('text-lg')).toBe(true);
				expect(validator.isValidClass('font-bold')).toBe(true);
				expect(validator.isValidClass('text-center')).toBe(true);
			});

			it('should validate layout utilities', () => {
				expect(validator.isValidClass('w-full')).toBe(true);
				expect(validator.isValidClass('h-screen')).toBe(true);
				expect(validator.isValidClass('grid')).toBe(true);
				expect(validator.isValidClass('grid-cols-3')).toBe(true);
			});
		});

		describe('variants', () => {
			it('should validate hover variants', () => {
				expect(validator.isValidClass('hover:bg-blue-500')).toBe(true);
				expect(validator.isValidClass('hover:text-white')).toBe(true);
			});

			it('should validate responsive variants', () => {
				expect(validator.isValidClass('md:flex')).toBe(true);
				expect(validator.isValidClass('lg:grid')).toBe(true);
				expect(validator.isValidClass('sm:hidden')).toBe(true);
			});

			it('should validate state variants', () => {
				expect(validator.isValidClass('focus:outline-none')).toBe(true);
				expect(validator.isValidClass('active:bg-blue-700')).toBe(true);
			});

			it('should validate dark mode variants', () => {
				expect(validator.isValidClass('dark:bg-gray-900')).toBe(true);
				expect(validator.isValidClass('dark:text-white')).toBe(true);
			});

			it('should validate combined variants', () => {
				expect(validator.isValidClass('md:hover:bg-blue-500')).toBe(true);
				expect(validator.isValidClass('dark:md:flex')).toBe(true);
			});
		});

		describe('arbitrary values', () => {
			it('should validate arbitrary width values', () => {
				expect(validator.isValidClass('w-[100px]')).toBe(true);
				expect(validator.isValidClass('w-[50%]')).toBe(true);
				expect(validator.isValidClass('w-[calc(100%-2rem)]')).toBe(true);
			});

			it('should validate arbitrary height values', () => {
				expect(validator.isValidClass('h-[50vh]')).toBe(true);
				expect(validator.isValidClass('h-[200px]')).toBe(true);
			});

			it('should validate arbitrary color values', () => {
				expect(validator.isValidClass('bg-[#ff0000]')).toBe(true);
				expect(validator.isValidClass('text-[rgb(255,0,0)]')).toBe(true);
				expect(validator.isValidClass('bg-[hsl(0,100%,50%)]')).toBe(true);
			});

			it('should validate arbitrary padding/margin values', () => {
				expect(validator.isValidClass('p-[20px]')).toBe(true);
				expect(validator.isValidClass('m-[1.5rem]')).toBe(true);
			});

			it('should validate arbitrary font size values', () => {
				expect(validator.isValidClass('text-[14px]')).toBe(true);
				expect(validator.isValidClass('text-[1.5rem]')).toBe(true);
			});
		});

		describe('custom theme colors (Tailwind v4)', () => {
			let customValidator: TailwindValidator;
			let customTempDir: string;

			beforeAll(async () => {
				// Create a CSS file with custom colors defined using Tailwind v4 @theme
				customTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-custom-'));
				const customCssFile = path.join(customTempDir, 'custom.css');
				const cssContent = `@import "tailwindcss";

@theme {
  --color-brand: #ff6b6b;
  --color-accent: #4ecdc4;
  --color-custom-blue: oklch(0.5 0.2 240);
}`;
				fs.writeFileSync(customCssFile, cssContent);

				customValidator = new TailwindValidator(customCssFile);
				await customValidator.initialize();
			});

			it('should validate custom background colors', () => {
				expect(customValidator.isValidClass('bg-brand')).toBe(true);
				expect(customValidator.isValidClass('bg-accent')).toBe(true);
				expect(customValidator.isValidClass('bg-custom-blue')).toBe(true);
			});

			it('should validate custom text colors', () => {
				expect(customValidator.isValidClass('text-brand')).toBe(true);
				expect(customValidator.isValidClass('text-accent')).toBe(true);
				expect(customValidator.isValidClass('text-custom-blue')).toBe(true);
			});

			it('should validate custom border colors', () => {
				expect(customValidator.isValidClass('border-brand')).toBe(true);
				expect(customValidator.isValidClass('border-accent')).toBe(true);
				expect(customValidator.isValidClass('border-custom-blue')).toBe(true);
			});

			it('should validate custom colors with variants', () => {
				expect(customValidator.isValidClass('hover:bg-brand')).toBe(true);
				expect(customValidator.isValidClass('dark:text-accent')).toBe(true);
				expect(customValidator.isValidClass('md:border-custom-blue')).toBe(true);
			});

			it('should still reject invalid custom color names', () => {
				expect(customValidator.isValidClass('bg-nonexistent')).toBe(false);
				expect(customValidator.isValidClass('text-fake-color')).toBe(false);
			});
		});

		describe('invalid classes', () => {
			it('should reject completely invalid class names', () => {
				expect(validator.isValidClass('invalid-class')).toBe(false);
				expect(validator.isValidClass('random-name')).toBe(false);
				expect(validator.isValidClass('not-a-class')).toBe(false);
			});

			it('should reject typos in standard classes', () => {
				expect(validator.isValidClass('flexs')).toBe(false);
				expect(validator.isValidClass('itms-center')).toBe(false);
				expect(validator.isValidClass('jusitfy-center')).toBe(false);
			});

			it('should reject invalid variants', () => {
				expect(validator.isValidClass('invalid-variant:bg-blue-500')).toBe(false);
				expect(validator.isValidClass('fake:text-white')).toBe(false);
			});

			it('should reject malformed arbitrary values', () => {
				expect(validator.isValidClass('w-[')).toBe(false);
				expect(validator.isValidClass('w-[]')).toBe(false);
			});
		});
	});

	describe('getInvalidClasses', () => {
		it('should return empty array for all valid classes', () => {
			const classes = ['flex', 'items-center', 'justify-center', 'bg-blue-500'];
			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual([]);
		});

		it('should return array of invalid classes', () => {
			const classes = ['flex', 'invalid-class', 'items-center', 'another-invalid'];
			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual(['invalid-class', 'another-invalid']);
		});

		it('should handle mixed valid and invalid classes', () => {
			const classes = [
				'flex',
				'invalid-one',
				'bg-blue-500',
				'hover:bg-blue-600',
				'invalid-two',
				'w-[100px]'
			];
			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual(['invalid-one', 'invalid-two']);
		});

		it('should handle empty array', () => {
			const invalid = validator.getInvalidClasses([]);
			expect(invalid).toEqual([]);
		});
	});

	describe('setAllowedClasses', () => {
		it('should allow custom classes when set', () => {
			validator.setAllowedClasses(['my-custom-class', 'another-custom']);
			expect(validator.isValidClass('my-custom-class')).toBe(true);
			expect(validator.isValidClass('another-custom')).toBe(true);
		});

		it('should allow custom classes alongside Tailwind classes', () => {
			validator.setAllowedClasses(['custom-button', 'custom-input']);
			expect(validator.isValidClass('custom-button')).toBe(true);
			expect(validator.isValidClass('flex')).toBe(true);
			expect(validator.isValidClass('bg-blue-500')).toBe(true);
			expect(validator.isValidClass('invalid-class')).toBe(false);
		});

		it('should clear validation cache when setting allowed classes', () => {
			// First call - will be cached
			expect(validator.isValidClass('my-custom')).toBe(false);

			// Set as allowed
			validator.setAllowedClasses(['my-custom']);

			// Should now be valid (cache cleared)
			expect(validator.isValidClass('my-custom')).toBe(true);
		});

		it('should work with getInvalidClasses', () => {
			validator.setAllowedClasses(['app-specific-class', 'project-util']);
			const classes = ['flex', 'app-specific-class', 'invalid-one', 'project-util', 'invalid-two'];
			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual(['invalid-one', 'invalid-two']);
		});

		it('should handle empty allowed classes array', () => {
			validator.setAllowedClasses([]);
			expect(validator.isValidClass('flex')).toBe(true);
			expect(validator.isValidClass('custom-class')).toBe(false);
		});

		it('should support prefix wildcard patterns (custom-*)', () => {
			validator.setAllowedClasses(['custom-*']);
			expect(validator.isValidClass('custom-button')).toBe(true);
			expect(validator.isValidClass('custom-card')).toBe(true);
			expect(validator.isValidClass('custom-')).toBe(true);
			expect(validator.isValidClass('mycustom-button')).toBe(false);
			expect(validator.isValidClass('not-matching')).toBe(false);
		});

		it('should support suffix wildcard patterns (*-icon)', () => {
			validator.setAllowedClasses(['*-icon']);
			expect(validator.isValidClass('arrow-icon')).toBe(true);
			expect(validator.isValidClass('close-icon')).toBe(true);
			expect(validator.isValidClass('-icon')).toBe(true);
			expect(validator.isValidClass('arrow-icons')).toBe(false);
			expect(validator.isValidClass('icon-arrow')).toBe(false);
		});

		it('should support contains wildcard patterns (*-component-*)', () => {
			validator.setAllowedClasses(['*-component-*']);
			expect(validator.isValidClass('app-component-header')).toBe(true);
			expect(validator.isValidClass('main-component-footer')).toBe(true);
			expect(validator.isValidClass('-component-')).toBe(true);
			expect(validator.isValidClass('component-header')).toBe(false);
			expect(validator.isValidClass('app-component')).toBe(false);
		});

		it('should support mixed exact and pattern classes', () => {
			validator.setAllowedClasses(['exact-match', 'custom-*', '*-icon']);
			expect(validator.isValidClass('exact-match')).toBe(true);
			expect(validator.isValidClass('custom-button')).toBe(true);
			expect(validator.isValidClass('arrow-icon')).toBe(true);
			expect(validator.isValidClass('exact-match-extra')).toBe(false);
			expect(validator.isValidClass('unknown')).toBe(false);
		});

		it('should treat lone * as exact match', () => {
			validator.setAllowedClasses(['*']);
			expect(validator.isValidClass('*')).toBe(true);
			expect(validator.isValidClass('anything')).toBe(false);
		});

		it('should work with getInvalidClasses and patterns', () => {
			validator.setAllowedClasses(['custom-*', '*-icon']);
			const classes = ['custom-btn', 'arrow-icon', 'invalid-one', 'flex'];
			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual(['invalid-one']);
		});
	});

	describe('reload', () => {
		it('should reload the design system', async () => {
			const wasBefore = validator.isInitialized();
			await validator.reload();
			const isAfter = validator.isInitialized();
			expect(wasBefore).toBe(true);
			expect(isAfter).toBe(true);
		});

		it('should clear validation cache on reload', async () => {
			// First, validate a class to populate the cache
			expect(validator.isValidClass('flex')).toBe(true);
			const statsBefore = validator.getCacheStats();
			expect(statsBefore.size).toBeGreaterThan(0);

			// Reload should clear the cache
			await validator.reload();

			// Cache should be cleared after reload
			const statsAfter = validator.getCacheStats();
			expect(statsAfter.size).toBe(0);
		});

		it('should recognize new classes after reload with updated CSS', async () => {
			// Create a new validator with a CSS file we can modify
			const reloadTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-reload-'));
			const reloadCssFile = path.join(reloadTempDir, 'reload-test.css');

			// Start with basic Tailwind
			fs.writeFileSync(reloadCssFile, '@import "tailwindcss";');

			const reloadValidator = new TailwindValidator(reloadCssFile);
			await reloadValidator.initialize();

			// Custom class should be invalid initially
			expect(reloadValidator.isValidClass('custom-reload-class')).toBe(false);

			// Update CSS to add custom utility
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@utility custom-reload-class {
  display: flex;
  align-items: center;
}`
			);

			// Reload the validator
			await reloadValidator.reload();

			// Now the custom class should be valid
			expect(reloadValidator.isValidClass('custom-reload-class')).toBe(true);

			// Clean up
			fs.rmSync(reloadTempDir, { recursive: true });
		});

		it('should recognize new theme colors after reload', async () => {
			// Create a new validator with a CSS file we can modify
			const reloadTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-theme-reload-'));
			const reloadCssFile = path.join(reloadTempDir, 'theme-reload-test.css');

			// Start with basic Tailwind
			fs.writeFileSync(reloadCssFile, '@import "tailwindcss";');

			const reloadValidator = new TailwindValidator(reloadCssFile);
			await reloadValidator.initialize();

			// Custom color should be invalid initially
			expect(reloadValidator.isValidClass('bg-pepe')).toBe(false);
			expect(reloadValidator.isValidClass('text-pepe')).toBe(false);

			// Update CSS to add custom theme color (Tailwind v4 syntax)
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@theme {
  --color-pepe: #ff0000;
}`
			);

			// Reload the validator
			await reloadValidator.reload();

			// Now the custom color classes should be valid
			expect(reloadValidator.isValidClass('bg-pepe')).toBe(true);
			expect(reloadValidator.isValidClass('text-pepe')).toBe(true);
			expect(reloadValidator.isValidClass('border-pepe')).toBe(true);

			// Clean up
			fs.rmSync(reloadTempDir, { recursive: true });
		});

		it('should handle multiple reloads correctly', async () => {
			// Create a new validator with a CSS file we can modify
			const reloadTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-multi-reload-'));
			const reloadCssFile = path.join(reloadTempDir, 'multi-reload-test.css');

			// Start with basic Tailwind
			fs.writeFileSync(reloadCssFile, '@import "tailwindcss";');

			const reloadValidator = new TailwindValidator(reloadCssFile);
			await reloadValidator.initialize();

			// First reload: add custom-class-1
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@utility custom-class-1 {
  display: flex;
}`
			);
			await reloadValidator.reload();
			expect(reloadValidator.isValidClass('custom-class-1')).toBe(true);
			expect(reloadValidator.isValidClass('custom-class-2')).toBe(false);

			// Second reload: add custom-class-2, keep custom-class-1
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@utility custom-class-1 {
  display: flex;
}

@utility custom-class-2 {
  display: grid;
}`
			);
			await reloadValidator.reload();
			expect(reloadValidator.isValidClass('custom-class-1')).toBe(true);
			expect(reloadValidator.isValidClass('custom-class-2')).toBe(true);

			// Third reload: remove custom-class-1, keep custom-class-2
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@utility custom-class-2 {
  display: grid;
}`
			);
			await reloadValidator.reload();
			expect(reloadValidator.isValidClass('custom-class-1')).toBe(false);
			expect(reloadValidator.isValidClass('custom-class-2')).toBe(true);

			// Clean up
			fs.rmSync(reloadTempDir, { recursive: true });
		});

		it('should preserve standard Tailwind classes after reload', async () => {
			// Create a new validator
			const reloadTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-preserve-'));
			const reloadCssFile = path.join(reloadTempDir, 'preserve-test.css');

			fs.writeFileSync(reloadCssFile, '@import "tailwindcss";');

			const reloadValidator = new TailwindValidator(reloadCssFile);
			await reloadValidator.initialize();

			// Standard classes should be valid
			expect(reloadValidator.isValidClass('flex')).toBe(true);
			expect(reloadValidator.isValidClass('items-center')).toBe(true);
			expect(reloadValidator.isValidClass('bg-blue-500')).toBe(true);

			// Reload
			await reloadValidator.reload();

			// Standard classes should still be valid
			expect(reloadValidator.isValidClass('flex')).toBe(true);
			expect(reloadValidator.isValidClass('items-center')).toBe(true);
			expect(reloadValidator.isValidClass('bg-blue-500')).toBe(true);

			// Clean up
			fs.rmSync(reloadTempDir, { recursive: true });
		});

		it('should work with getInvalidClasses after reload', async () => {
			// Create a new validator
			const reloadTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-invalid-reload-'));
			const reloadCssFile = path.join(reloadTempDir, 'invalid-reload-test.css');

			fs.writeFileSync(reloadCssFile, '@import "tailwindcss";');

			const reloadValidator = new TailwindValidator(reloadCssFile);
			await reloadValidator.initialize();

			// Before reload: custom-valid should be invalid
			let invalidClasses = reloadValidator.getInvalidClasses([
				'flex',
				'custom-valid',
				'items-center'
			]);
			expect(invalidClasses).toContain('custom-valid');

			// Add custom utility
			fs.writeFileSync(
				reloadCssFile,
				`@import "tailwindcss";

@utility custom-valid {
  display: block;
}`
			);
			await reloadValidator.reload();

			// After reload: custom-valid should be valid
			invalidClasses = reloadValidator.getInvalidClasses(['flex', 'custom-valid', 'items-center']);
			expect(invalidClasses).not.toContain('custom-valid');
			expect(invalidClasses.length).toBe(0);

			// Clean up
			fs.rmSync(reloadTempDir, { recursive: true });
		});
	});

	describe('getSimilarClasses', () => {
		it('should suggest similar classes for typos', () => {
			// "itms-center" is close to "items-center"
			const suggestions = validator.getSimilarClasses('itms-center');
			expect(suggestions).toContain('items-center');
		});

		it('should suggest similar classes for common misspellings', () => {
			// "flx" is close to "flex"
			const suggestions = validator.getSimilarClasses('flx');
			expect(suggestions).toContain('flex');
		});

		it('should return at most maxSuggestions results', () => {
			const suggestions = validator.getSimilarClasses('bg-blu', 2);
			expect(suggestions.length).toBeLessThanOrEqual(2);
		});

		it('should return empty array for completely unrelated strings', () => {
			const suggestions = validator.getSimilarClasses('xyzabc123notaclass');
			expect(suggestions.length).toBe(0);
		});

		it('should suggest bg- color variants for typos', () => {
			// "bg-bleu-500" is close to "bg-blue-500"
			const suggestions = validator.getSimilarClasses('bg-bleu-500');
			expect(suggestions).toContain('bg-blue-500');
		});

		it('should suggest text alignment for typos', () => {
			// "text-cener" is close to "text-center"
			const suggestions = validator.getSimilarClasses('text-cener');
			expect(suggestions).toContain('text-center');
		});
	});

	describe('getAllClasses', () => {
		it('should return array of all valid classes', () => {
			const allClasses = validator.getAllClasses();
			expect(Array.isArray(allClasses)).toBe(true);
			expect(allClasses.length).toBeGreaterThan(0);
			expect(allClasses).toContain('flex');
			expect(allClasses).toContain('items-center');
		});
	});
});
