import * as ts from 'typescript/lib/tsserverlibrary';

import { IClassNameValidator } from '../core/interfaces';
import { ClassNameExtractionService } from './ClassNameExtractionService';
import {
	DiagnosticService,
	TAILWIND_DUPLICATE_CODE,
	TAILWIND_EXTRACTABLE_CLASS_CODE
} from './DiagnosticService';
import { PluginConfigService } from './PluginConfigService';
import { ValidationService } from './ValidationService';

// Mock validator that considers all classes valid (for testing duplicates only)
class MockValidator implements IClassNameValidator {
	isInitialized(): boolean {
		return true;
	}

	isValidClass(): boolean {
		return true;
	}

	getInvalidClasses(): string[] {
		return [];
	}

	setAllowedClasses(): void {
		// No-op for testing
	}
}

describe('Duplicate Class Detection', () => {
	let validationService: ValidationService;
	let diagnosticService: DiagnosticService;
	let extractionService: ClassNameExtractionService;
	let mockValidator: MockValidator;
	let configService: PluginConfigService;

	beforeEach(() => {
		diagnosticService = new DiagnosticService();
		extractionService = new ClassNameExtractionService();
		mockValidator = new MockValidator();
		configService = new PluginConfigService({});
		validationService = new ValidationService(
			extractionService,
			diagnosticService,
			mockValidator,
			configService
		);
	});

	describe('simple string literals', () => {
		it('should detect duplicate classes in className string', () => {
			const sourceCode = '<div className="flex flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Should have 2 duplicate diagnostics (both "flex" occurrences)
			expect(diagnostics.length).toBe(2);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
			expect(diagnostics[0].category).toBe(ts.DiagnosticCategory.Warning);
			expect(diagnostics[0].messageText).toContain('Duplicate class "flex"');
		});

		it('should detect multiple duplicate classes', () => {
			const sourceCode = '<div className="flex flex items-center items-center p-4">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Should have 4 duplicate diagnostics (2 for flex, 2 for items-center)
			expect(diagnostics.length).toBe(4);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});

		it('should not flag same class in different elements', () => {
			const sourceCode = `
				<div className="flex">
					<span className="flex">Hello</span>
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

			// Should have no duplicates - each "flex" is in a different attribute
			expect(diagnostics.length).toBe(0);
		});

		it('should flag all duplicate occurrences', () => {
			const sourceCode = '<div className="flex flex flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Should have 3 duplicate diagnostics (for all "flex" occurrences)
			expect(diagnostics.length).toBe(3);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});
	});

	describe('JSX expressions', () => {
		it('should detect duplicates in JSX expression with string literal', () => {
			const sourceCode = "<div className={'flex flex items-center'}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBe(2);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});

		it('should detect duplicates in template literals', () => {
			const sourceCode = '<div className={`flex flex items-center`}>Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBe(2);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});
	});

	describe('utility function calls', () => {
		it('should detect duplicates in clsx arguments', () => {
			const sourceCode = "<div className={clsx('flex', 'flex', 'items-center')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			expect(diagnostics.length).toBe(2);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});

		it('should detect duplicates in cn function arguments', () => {
			const sourceCode = "<div className={cn('p-4 p-4 m-2')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['cn']);

			expect(diagnostics.length).toBe(2);
			expect(diagnostics.every(d => d.code === TAILWIND_DUPLICATE_CODE)).toBe(true);
		});
	});

	describe('diagnostic message format', () => {
		it('should have correct warning message', () => {
			const sourceCode = '<div className="bg-red-500 bg-red-500">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics[0].messageText).toBe('Duplicate class "bg-red-500"');
		});

		it('should have source set to tw-plugin', () => {
			const sourceCode = '<div className="flex flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics[0].source).toBe('tw-plugin');
		});
	});

	describe('no false positives', () => {
		it('should not flag unique classes', () => {
			const sourceCode =
				'<div className="flex items-center justify-between p-4 bg-white">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBe(0);
		});

		it('should not flag similar but different classes', () => {
			const sourceCode = '<div className="p-4 pt-4 px-4 py-4">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			expect(diagnostics.length).toBe(0);
		});
	});

	describe('ternary conditional expressions', () => {
		it('should flag duplicate when class is at root AND in ternary branches', () => {
			// Case: clsx('flex', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')
			// The root 'flex' + branch 'flex' = true duplicate
			const sourceCode =
				"<div className={clsx('flex', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			// Should have 3 duplicate warnings (root 'flex' + both branch 'flex')
			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(3);
			expect(duplicates.every(d => d.category === ts.DiagnosticCategory.Warning)).toBe(true);
		});

		it('should flag extractable class when class appears in both branches but NOT at root', () => {
			// Case: clsx('mt-4', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')
			// No root 'flex', but 'flex' in both branches = extractable hint (can be moved outside)
			const sourceCode =
				"<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'flex bg-gray-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			// 2 extractable hints - one for each 'flex' in both branches
			const extractable = diagnostics.filter(d => d.code === TAILWIND_EXTRACTABLE_CLASS_CODE);
			expect(extractable.length).toBe(2);
			expect(extractable.every(d => d.category === ts.DiagnosticCategory.Warning)).toBe(true);
		});

		it('should not flag class in only one ternary branch', () => {
			// Case: clsx('mt-4', isActive ? 'flex bg-blue-500' : 'bg-gray-500')
			// 'flex' only in true branch = no issue
			const sourceCode =
				"<div className={clsx('mt-4', isActive ? 'flex bg-blue-500' : 'bg-gray-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			expect(diagnostics.length).toBe(0);
		});

		it('should flag duplicate within same ternary branch', () => {
			// Case: clsx('mt-4', isActive ? 'flex flex bg-blue-500' : 'bg-gray-500')
			// 'flex' twice in true branch = true duplicate (both flagged)
			const sourceCode =
				"<div className={clsx('mt-4', isActive ? 'flex flex bg-blue-500' : 'bg-gray-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => d.category === ts.DiagnosticCategory.Warning)).toBe(true);
		});

		it('should flag extractable class for simple ternary with same class in both branches', () => {
			// Case: className={isActive ? 'flex bg-blue-500' : 'flex bg-gray-500'}
			// Same class in both branches = extractable hint (can be moved outside)
			const sourceCode =
				"<div className={isActive ? 'flex bg-blue-500' : 'flex bg-gray-500'}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// 2 extractable hints - one for each 'flex' in both branches
			const extractable = diagnostics.filter(d => d.code === TAILWIND_EXTRACTABLE_CLASS_CODE);
			expect(extractable.length).toBe(2);
		});

		it('should flag extractable classes for multiple classes appearing in both ternary branches', () => {
			// Case: className={isActive ? 'flex items-center p-4' : 'flex items-center m-4'}
			// Both 'flex' and 'items-center' appear in both branches = extractable hints
			const sourceCode =
				"<div className={isActive ? 'flex items-center p-4' : 'flex items-center m-4'}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// 4 extractable hints - 2 for 'flex' + 2 for 'items-center' (in both branches)
			const extractable = diagnostics.filter(d => d.code === TAILWIND_EXTRACTABLE_CLASS_CODE);
			expect(extractable.length).toBe(4);
		});
	});

	describe('binary expressions (&&)', () => {
		it('should flag duplicate when class is at root AND in binary && branch', () => {
			// Case: clsx('flex', isError && 'flex text-red-500')
			// Root 'flex' + conditional 'flex' = duplicate when condition is true
			const sourceCode =
				"<div className={clsx('flex', isError && 'flex text-red-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			// Should warn - both root 'flex' and branch 'flex' are flagged
			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
		});

		it('should NOT flag class only in binary && branch (no root duplicate)', () => {
			// Case: clsx('mt-4', isError && 'flex text-red-500')
			// No root 'flex', just conditional = no duplicate
			const sourceCode =
				"<div className={clsx('mt-4', isError && 'flex text-red-500')}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			expect(diagnostics.length).toBe(0);
		});
	});

	describe('arrays with conditionals', () => {
		it('should flag duplicate when array contains conditional with same class', () => {
			// Case: ['flex', isActive && 'flex']
			const sourceCode = "<div className={clsx(['flex', isActive && 'flex'])}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
		});

		it('should NOT flag when array conditional has different class', () => {
			// Case: ['flex', isActive && 'items-center']
			const sourceCode = "<div className={clsx(['flex', isActive && 'items-center'])}>Hello</div>";
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, ['clsx']);

			expect(diagnostics.length).toBe(0);
		});
	});

	describe('tailwind-variants tv() duplicate detection', () => {
		it('should detect duplicates in tv() base property', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex flex items-center'
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should detect duplicates across tv() base and variants', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex items-center',
					variants: {
						size: {
							sm: 'flex text-sm'
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should detect duplicates in tv() compoundVariants', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex items-center',
					compoundVariants: [
						{ size: 'sm', class: 'flex font-bold' }
					]
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should NOT flag duplicates between different tv() calls', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex items-center'
				});
				const card = tv({
					base: 'flex justify-center'
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

			// Each tv() call has its own scope, so no duplicates
			expect(diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE).length).toBe(0);
		});

		it('should detect duplicates in tv() slots', () => {
			const sourceCode = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						base: 'flex flex items-center',
						content: 'p-4'
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});
	});

	describe('class-variance-authority cva() duplicate detection', () => {
		it('should detect duplicates in cva() base array', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'flex', 'items-center']);
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should detect duplicates across cva() base and variants', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'items-center'], {
					variants: {
						intent: {
							primary: ['flex', 'bg-blue-500']
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should detect duplicates in cva() compoundVariants', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'items-center'], {
					compoundVariants: [
						{ intent: 'primary', class: 'flex font-bold' }
					]
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

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});

		it('should NOT flag duplicates between different cva() calls', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'items-center']);
				const card = cva(['flex', 'justify-center']);
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			// Each cva() call has its own scope, so no duplicates
			expect(diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE).length).toBe(0);
		});

		it('should detect duplicates in cva() string base', () => {
			const sourceCode = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex flex items-center');
			`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const diagnostics = validationService.validateFile(ts, sourceFile, []);

			const duplicates = diagnostics.filter(d => d.code === TAILWIND_DUPLICATE_CODE);
			expect(duplicates.length).toBe(2);
			expect(duplicates.every(d => (d.messageText as string).includes('flex'))).toBe(true);
		});
	});
});
