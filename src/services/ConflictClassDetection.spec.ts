import * as ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';
import path from 'path';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { NoOpLogger } from '../utils/Logger';
import { ClassNameExtractionService } from './ClassNameExtractionService';
import { DiagnosticService, TAILWIND_CONFLICT_CODE } from './DiagnosticService';
import { ValidationService } from './ValidationService';

describe('Conflicting Class Detection', () => {
	let validationService: ValidationService;
	let diagnosticService: DiagnosticService;
	let extractionService: ClassNameExtractionService;
	let validator: TailwindValidator;
	let logger: NoOpLogger;
	const testCssFile = path.join(__dirname, '../../test-conflict-global.css');

	beforeAll(async () => {
		// Create a simple CSS file for testing
		fs.writeFileSync(testCssFile, '@import "tailwindcss";');

		// Initialize the real validator
		logger = new NoOpLogger();
		validator = new TailwindValidator(testCssFile, logger);
		await validator.initialize();
	});

	afterAll(() => {
		// Clean up test CSS file
		if (fs.existsSync(testCssFile)) {
			fs.unlinkSync(testCssFile);
		}
	});

	beforeEach(() => {
		diagnosticService = new DiagnosticService();
		extractionService = new ClassNameExtractionService();
		validationService = new ValidationService(
			extractionService,
			diagnosticService,
			validator,
			logger,
			validator // Pass as CSS provider for conflict detection
		);
	});

	describe('text-align conflicts', () => {
		it('should detect conflicting text alignment classes on ALL classes', () => {
			const sourceCode = '<div className="text-left text-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			// Both text-left and text-center should be flagged
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => c.category === ts.DiagnosticCategory.Warning)).toBe(true);
			expect(conflicts.some(c => (c.messageText as string).includes('text-left'))).toBe(true);
			expect(conflicts.some(c => (c.messageText as string).includes('text-center'))).toBe(true);
			expect(conflicts.every(c => (c.messageText as string).includes('text-align'))).toBe(true);
		});

		it('should detect multiple text alignment conflicts on ALL classes', () => {
			const sourceCode = '<div className="text-left text-center text-right">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			// All three classes should be flagged
			expect(conflicts.length).toBe(3);
		});
	});

	describe('display conflicts', () => {
		it('should detect conflicting display classes on both', () => {
			const sourceCode = '<div className="flex block">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.some(c => (c.messageText as string).includes('block'))).toBe(true);
			expect(conflicts.some(c => (c.messageText as string).includes('flex'))).toBe(true);
			expect(conflicts.every(c => (c.messageText as string).includes('display'))).toBe(true);
		});

		it('should detect grid vs flex conflict on both', () => {
			const sourceCode = '<div className="grid flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});

		it('should detect hidden vs flex display conflict on both', () => {
			const sourceCode = '<div className="flex hidden">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});
	});

	describe('position conflicts', () => {
		it('should detect conflicting position classes on both', () => {
			const sourceCode = '<div className="absolute relative">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('position'))).toBe(true);
		});

		it('should detect sticky vs fixed conflict on both', () => {
			const sourceCode = '<div className="sticky fixed">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});
	});

	describe('flex-direction conflicts', () => {
		it('should detect conflicting flex direction classes on both', () => {
			const sourceCode = '<div className="flex-row flex-col">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('flex-direction'))).toBe(true);
		});
	});

	describe('justify-content conflicts', () => {
		it('should detect conflicting justify classes on both', () => {
			const sourceCode = '<div className="justify-start justify-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('justify-content'))).toBe(
				true
			);
		});
	});

	describe('align-items conflicts', () => {
		it('should detect conflicting align-items classes on both', () => {
			const sourceCode = '<div className="items-start items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('align-items'))).toBe(true);
		});
	});

	describe('no false positives', () => {
		it('should not flag different utility types', () => {
			const sourceCode = '<div className="flex items-center justify-between p-4">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});

		it('should not flag same class in different elements', () => {
			const sourceCode = `
				<div className="text-left">
					<span className="text-center">Hello</span>
				</div>
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});

		it('should not flag duplicate classes as conflicts', () => {
			// Same class repeated is a duplicate, not a conflict
			const sourceCode = '<div className="text-left text-left">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0); // Should be duplicate, not conflict
		});

		it('should not flag similar but non-conflicting classes', () => {
			// p-4 and pt-4 don't conflict - they're different properties
			const sourceCode = '<div className="p-4 pt-8">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});
	});

	describe('ternary conditional expressions', () => {
		it('should NOT flag conflicts in different ternary branches', () => {
			// text-left in true branch, text-center in false branch = no conflict (mutually exclusive)
			const sourceCode = "<div className={isActive ? 'text-left' : 'text-center'}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});

		it('should flag conflict when root class conflicts with branch class (both flagged)', () => {
			// Root 'text-left' + branch 'text-center' = conflict on both
			const sourceCode =
				"<div className={clsx('text-left', isActive && 'text-center')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});

		it('should flag conflicts within same branch (both flagged)', () => {
			// Both text-left and text-center in the true branch = conflict
			const sourceCode =
				"<div className={isActive ? 'text-left text-center' : 'text-right'}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});
	});

	describe('utility function calls', () => {
		it('should detect conflicts in clsx arguments (both flagged)', () => {
			const sourceCode = "<div className={clsx('flex', 'block', 'items-center')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});

		it('should detect conflicts in cn function (both flagged)', () => {
			const sourceCode = "<div className={cn('text-left text-right')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['cn']);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});
	});

	describe('responsive variants', () => {
		it('should detect conflicts with responsive variants (both flagged)', () => {
			const sourceCode = '<div className="md:text-left md:text-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
		});

		it('should NOT flag same utility with different breakpoints as conflict', () => {
			// sm:text-left and md:text-center apply at different breakpoints
			const sourceCode = '<div className="sm:text-left md:text-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			// Different prefixes mean different media queries, so no conflict
			expect(conflicts.length).toBe(0);
		});
	});

	describe('overflow conflicts', () => {
		it('should detect conflicting overflow classes on both', () => {
			const sourceCode = '<div className="overflow-hidden overflow-scroll">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('overflow'))).toBe(true);
		});
	});

	describe('visibility conflicts', () => {
		it('should detect conflicting visibility classes on both', () => {
			const sourceCode = '<div className="visible invisible">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('visibility'))).toBe(true);
		});
	});

	describe('font style conflicts', () => {
		it('should detect conflicting font style classes on both', () => {
			const sourceCode = '<div className="italic not-italic">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('font-style'))).toBe(true);
		});
	});

	describe('text transform conflicts', () => {
		it('should detect conflicting text transform classes on both', () => {
			const sourceCode = '<div className="uppercase lowercase">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('text-transform'))).toBe(true);
		});
	});

	describe('diagnostic message format', () => {
		it('should have correct warning message format on both classes', () => {
			const sourceCode = '<div className="flex grid">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			// One should say flex conflicts with grid, other says grid conflicts with flex
			expect(
				conflicts.some(c => (c.messageText as string).includes('"flex" conflicts with "grid"'))
			).toBe(true);
			expect(
				conflicts.some(c => (c.messageText as string).includes('"grid" conflicts with "flex"'))
			).toBe(true);
			expect(conflicts.every(c => (c.messageText as string).includes('display property'))).toBe(
				true
			);
		});

		it('should have source set to tw-plugin', () => {
			const sourceCode = '<div className="text-left text-right">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.every(c => c.source === 'tw-plugin')).toBe(true);
		});
	});

	describe('tailwind-variants tv() conflict detection', () => {
		it('should detect conflicts in tv() base property (both flagged)', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex block items-center'
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('display'))).toBe(true);
		});

		it('should NOT detect conflicts between tv() base and variants (variants are designed to override)', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'text-left items-center',
					variants: {
						align: {
							center: 'text-center'
						}
					}
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Base vs variant classes should NOT conflict - variants are designed to override base styles
			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});

		it('should NOT flag conflicts between different tv() calls', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'text-left'
				});
				const card = tv({
					base: 'text-center'
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Each tv() call has its own scope, so no conflicts
			expect(diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE).length).toBe(0);
		});
	});

	describe('class-variance-authority cva() conflict detection', () => {
		it('should detect conflicts in cva() base array (both flagged)', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'grid', 'items-center']);
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('display'))).toBe(true);
		});

		it('should NOT detect conflicts between cva() base and variants (variants are designed to override)', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['justify-start'], {
					variants: {
						centered: {
							true: ['justify-center']
						}
					}
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Base vs variant classes should NOT conflict - variants are designed to override base styles
			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(0);
		});

		it('should NOT flag conflicts between different cva() calls', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex']);
				const card = cva(['grid']);
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Each cva() call has its own scope, so no conflicts
			expect(diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE).length).toBe(0);
		});

		it('should detect conflicts within same variant option in cva()', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['items-center'], {
					variants: {
						align: {
							left: ['text-left', 'text-center']
						}
					}
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Conflicts within the same variant option SHOULD be flagged
			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('text-align'))).toBe(true);
		});
	});

	describe('tv() variant conflict edge cases', () => {
		it('should detect conflicts within same variant option in tv()', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'items-center',
					variants: {
						align: {
							weird: 'text-left text-center'
						}
					}
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Conflicts within the same variant option SHOULD be flagged
			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(2);
			expect(conflicts.every(c => (c.messageText as string).includes('text-align'))).toBe(true);
		});

		it('should flag conflicts between different variant options in tv() (known limitation)', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'items-center',
					variants: {
						align: {
							left: 'text-left',
							center: 'text-center',
							right: 'text-right'
						}
					}
				});
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Note: Ideally different variant options are mutually exclusive (only one active at runtime),
			// so they shouldn't conflict. However, this would require tracking which variant OPTION
			// each class belongs to, which adds complexity. For now, we flag these as conflicts.
			// This is a known false positive - users can safely ignore these warnings for variant options.
			const conflicts = diagnostics.filter(d => d.code === TAILWIND_CONFLICT_CODE);
			expect(conflicts.length).toBe(3); // All three options flagged
		});
	});
});
