import fs from 'fs';
import os from 'os';
import path from 'path';

import { TailwindValidator } from './TailwindValidator';

describe('TailwindValidator - CSS Variables', () => {
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

	describe('CSS variable definitions', () => {
		it('should validate CSS variable definition with color', () => {
			expect(validator.isValidClass('[--card-bg:#1e293b]')).toBe(true);
		});

		it('should validate CSS variable definition with size', () => {
			expect(validator.isValidClass('[--card-radius:16px]')).toBe(true);
		});

		it('should validate CSS variable definition with arbitrary name', () => {
			expect(validator.isValidClass('[--my-custom-var:#ff0000]')).toBe(true);
		});

		it('should validate multiple CSS variable definitions', () => {
			expect(validator.isValidClass('[--color-primary:#3b82f6]')).toBe(true);
			expect(validator.isValidClass('[--color-secondary:#8b5cf6]')).toBe(true);
			expect(validator.isValidClass('[--spacing:1rem]')).toBe(true);
		});
	});

	describe('CSS variable usage', () => {
		it('should validate var() in background color', () => {
			expect(validator.isValidClass('bg-[var(--card-bg)]')).toBe(true);
		});

		it('should validate var() in border radius', () => {
			expect(validator.isValidClass('rounded-[var(--card-radius)]')).toBe(true);
		});

		it('should validate var() in text color', () => {
			expect(validator.isValidClass('text-[var(--my-color)]')).toBe(true);
		});

		it('should validate var() in width', () => {
			expect(validator.isValidClass('w-[var(--my-size)]')).toBe(true);
		});

		it('should validate var() in height', () => {
			expect(validator.isValidClass('h-[var(--my-size)]')).toBe(true);
		});
	});

	describe('combined CSS variables', () => {
		it('should validate all classes from user example', () => {
			const classes = [
				'[--card-bg:#1e293b]',
				'[--card-radius:16px]',
				'bg-[var(--card-bg)]',
				'rounded-[var(--card-radius)]',
				'p-4'
			];

			classes.forEach(className => {
				expect(validator.isValidClass(className)).toBe(true);
			});
		});

		it('should have no invalid classes in combined example', () => {
			const classes = [
				'[--card-bg:#1e293b]',
				'[--card-radius:16px]',
				'bg-[var(--card-bg)]',
				'rounded-[var(--card-radius)]',
				'p-4'
			];

			const invalid = validator.getInvalidClasses(classes);
			expect(invalid).toEqual([]);
		});
	});
});
