import fs from 'fs';
import os from 'os';
import path from 'path';

import { TailwindValidator } from '../TailwindValidator';
import { Logger } from '../utils/Logger';

// Mock logger for testing
class MockLogger implements Logger {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	log(_message: string): void {
		// Silent during tests
	}
}

describe('TailwindValidator', () => {
	let validator: TailwindValidator;
	let tempCssFile: string;

	beforeAll(async () => {
		// Create a temporary CSS file for testing
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tailwind-test-'));
		tempCssFile = path.join(tempDir, 'global.css');
		fs.writeFileSync(tempCssFile, '@import "tailwindcss";');

		validator = new TailwindValidator(tempCssFile, new MockLogger());
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

				customValidator = new TailwindValidator(customCssFile, new MockLogger());
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

	describe('reload', () => {
		it('should reload the design system', async () => {
			const wasBefore = validator.isInitialized();
			await validator.reload();
			const isAfter = validator.isInitialized();
			expect(wasBefore).toBe(true);
			expect(isAfter).toBe(true);
		});
	});
});
