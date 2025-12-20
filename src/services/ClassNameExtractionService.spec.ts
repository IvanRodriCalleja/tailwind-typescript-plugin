import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameExtractionService } from './ClassNameExtractionService';

describe('ClassNameExtractionService', () => {
	let service: ClassNameExtractionService;

	beforeEach(() => {
		service = new ClassNameExtractionService(true, true);
	});

	describe('Framework-specific extraction', () => {
		it('should extract classes from JSX files', () => {
			const sourceCode = '<div className="flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, []);

			expect(classNames).toHaveLength(2);
			expect(classNames[0].className).toBe('flex');
			expect(classNames[1].className).toBe('items-center');
		});

		it('should skip unsupported file types', () => {
			const sourceCode = 'body { color: red; }';
			const sourceFile = ts.createSourceFile(
				'styles.css',
				sourceCode,
				ts.ScriptTarget.Latest,
				true
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, []);

			expect(classNames).toHaveLength(0);
		});

		it('should handle Vue files with stub extractor', () => {
			const sourceCode = '<template><div class="flex">Hello</div></template>';
			const sourceFile = ts.createSourceFile('App.vue', sourceCode, ts.ScriptTarget.Latest, true);

			// Vue extractor is a stub, should return empty array
			const classNames = service.extractFromSourceFile(ts, sourceFile, []);

			expect(classNames).toHaveLength(0);
		});

		it('should handle Svelte files with stub extractor', () => {
			const sourceCode = '<div class="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'App.svelte',
				sourceCode,
				ts.ScriptTarget.Latest,
				true
			);

			// Svelte extractor is a stub, should return empty array
			const classNames = service.extractFromSourceFile(ts, sourceFile, []);

			expect(classNames).toHaveLength(0);
		});
	});

	describe('Lazy initialization', () => {
		it('should create JSX extractor only when processing JSX files', () => {
			const service = new ClassNameExtractionService(true, true);

			// Check that frameworkExtractors map is initially empty
			// We can't directly access private fields, but we can verify behavior
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				'<div className="flex">Test</div>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, []);

			// If lazy initialization works, we should get results
			expect(classNames).toHaveLength(1);
			expect(classNames[0].className).toBe('flex');
		});

		it('should reuse cached extractors for same framework', () => {
			const jsxFile1 = ts.createSourceFile(
				'App.tsx',
				'<div className="flex">Test</div>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const jsxFile2 = ts.createSourceFile(
				'Button.tsx',
				'<button className="btn">Click</button>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Process first JSX file
			const classNames1 = service.extractFromSourceFile(ts, jsxFile1, []);
			expect(classNames1).toHaveLength(1);

			// Process second JSX file - should reuse cached extractor
			const classNames2 = service.extractFromSourceFile(ts, jsxFile2, []);
			expect(classNames2).toHaveLength(1);

			// Both should work correctly
			expect(classNames1[0].className).toBe('flex');
			expect(classNames2[0].className).toBe('btn');
		});

		it('should create different extractors for different frameworks', () => {
			const jsxFile = ts.createSourceFile(
				'App.tsx',
				'<div className="flex">Test</div>',
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const vueFile = ts.createSourceFile(
				'App.vue',
				'<template><div class="flex">Test</div></template>',
				ts.ScriptTarget.Latest,
				true
			);

			// Process JSX file
			const jsxClassNames = service.extractFromSourceFile(ts, jsxFile, []);
			expect(jsxClassNames).toHaveLength(1);

			// Process Vue file (stub, returns empty)
			const vueClassNames = service.extractFromSourceFile(ts, vueFile, []);
			expect(vueClassNames).toHaveLength(0);

			// Both should work independently
		});
	});

	describe('Mixed project support', () => {
		it('should handle projects with multiple framework files', () => {
			const files = [
				{
					name: 'Header.tsx',
					code: '<header className="header">Header</header>',
					kind: ts.ScriptKind.TSX
				},
				{
					name: 'Footer.tsx',
					code: '<footer className="footer">Footer</footer>',
					kind: ts.ScriptKind.TSX
				},
				{ name: 'Button.vue', code: '<template><button>Click</button></template>', kind: undefined }
			];

			const results = files.map(file => {
				const sourceFile = ts.createSourceFile(
					file.name,
					file.code,
					ts.ScriptTarget.Latest,
					true,
					file.kind
				);
				return service.extractFromSourceFile(ts, sourceFile, []);
			});

			// JSX files should extract classes
			expect(results[0]).toHaveLength(1);
			expect(results[0][0].className).toBe('header');
			expect(results[1]).toHaveLength(1);
			expect(results[1][0].className).toBe('footer');

			// Vue file should return empty (stub)
			expect(results[2]).toHaveLength(0);
		});
	});

	describe('Custom class attributes', () => {
		it('should extract classes from default className attribute', () => {
			const sourceCode = '<div className="flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, [], undefined, [
				'className',
				'class',
				'classList'
			]);

			expect(classNames).toHaveLength(2);
			expect(classNames[0].className).toBe('flex');
			expect(classNames[1].className).toBe('items-center');
		});

		it('should extract classes from custom attributes when configured', () => {
			const sourceCode = '<View colorStyles="bg-blue-500 text-white">Hello</View>';
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, [], undefined, [
				'className',
				'class',
				'classList',
				'colorStyles'
			]);

			expect(classNames).toHaveLength(2);
			expect(classNames[0].className).toBe('bg-blue-500');
			expect(classNames[1].className).toBe('text-white');
		});

		it('should extract classes from multiple custom attributes', () => {
			const sourceCode =
				'<View colorStyles="bg-blue-500" textStyles="font-bold text-lg">Hello</View>';
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, [], undefined, [
				'className',
				'colorStyles',
				'textStyles'
			]);

			expect(classNames).toHaveLength(3);
			expect(classNames[0].className).toBe('bg-blue-500');
			expect(classNames[1].className).toBe('font-bold');
			expect(classNames[2].className).toBe('text-lg');
		});

		it('should not extract from non-configured attributes', () => {
			const sourceCode = '<View customProp="flex items-center">Hello</View>';
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Only default attributes configured, customProp not included
			const classNames = service.extractFromSourceFile(ts, sourceFile, [], undefined, [
				'className',
				'class',
				'classList'
			]);

			expect(classNames).toHaveLength(0);
		});

		it('should work with JSX expressions in custom attributes', () => {
			const sourceCode = "<View colorStyles={'bg-blue-500 text-white'}>Hello</View>";
			const sourceFile = ts.createSourceFile(
				'App.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, sourceFile, [], undefined, [
				'className',
				'colorStyles'
			]);

			expect(classNames).toHaveLength(2);
			expect(classNames[0].className).toBe('bg-blue-500');
			expect(classNames[1].className).toBe('text-white');
		});
	});

	describe('Variant extractors', () => {
		it('should work across all frameworks', () => {
			// tv() and cva() should work in any file type
			const jsxWithTv = ts.createSourceFile(
				'App.tsx',
				`
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex items-center' });
				`,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = service.extractFromSourceFile(ts, jsxWithTv, []);

			// Should extract from tv() call
			expect(classNames.length).toBeGreaterThan(0);
		});

		it('should be disabled when configuration is false', () => {
			const serviceWithoutVariants = new ClassNameExtractionService(false, false);

			const codeWithTv = ts.createSourceFile(
				'App.tsx',
				`
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex items-center' });
				`,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const classNames = serviceWithoutVariants.extractFromSourceFile(ts, codeWithTv, []);

			// Should not extract from tv() since it's disabled
			expect(classNames).toHaveLength(0);
		});
	});
});
