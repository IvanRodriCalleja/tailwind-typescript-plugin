import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { CvaExtractor } from './CvaExtractor';

describe('CvaExtractor', () => {
	let extractor: CvaExtractor;

	const createContext = (
		code: string,
		overrides: Partial<ExtractionContext> = {}
	): ExtractionContext => {
		const sourceFile = ts.createSourceFile(
			'test.tsx',
			code,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX
		);
		return {
			typescript: ts,
			sourceFile,
			utilityFunctions: [],
			...overrides
		};
	};

	/**
	 * Creates a context with a full TypeScript program and TypeChecker.
	 * This allows testing code paths that require type information.
	 */
	const createContextWithTypeChecker = (
		code: string,
		overrides: Partial<ExtractionContext> = {}
	): ExtractionContext => {
		const fileName = '/test.tsx';

		// Create a virtual file system
		const files: Record<string, string> = {
			[fileName]: code,
			// Add a minimal cva type declaration
			'/node_modules/class-variance-authority/index.d.ts': `
				export declare function cva<T>(base?: string, config?: T): (...args: any[]) => string;
			`
		};

		// Create a compiler host
		const compilerHost: ts.CompilerHost = {
			getSourceFile: (name: string, languageVersion: ts.ScriptTarget) => {
				const content = files[name];
				if (content !== undefined) {
					return ts.createSourceFile(name, content, languageVersion, true);
				}
				return undefined;
			},
			getDefaultLibFileName: () => '/lib.d.ts',
			writeFile: () => {},
			getCurrentDirectory: () => '/',
			getCanonicalFileName: (f: string) => f,
			useCaseSensitiveFileNames: () => true,
			getNewLine: () => '\n',
			fileExists: (name: string) => name in files,
			readFile: (name: string) => files[name],
			directoryExists: () => true,
			getDirectories: () => []
		};

		// Create a program
		const program = ts.createProgram([fileName], {
			target: ts.ScriptTarget.Latest,
			module: ts.ModuleKind.ESNext,
			jsx: ts.JsxEmit.React,
			strict: true,
			moduleResolution: ts.ModuleResolutionKind.NodeJs
		}, compilerHost);

		const sourceFile = program.getSourceFile(fileName)!;
		const typeChecker = program.getTypeChecker();

		return {
			typescript: ts,
			sourceFile,
			typeChecker,
			utilityFunctions: [],
			...overrides
		};
	};

	const findCallExpression = (sourceFile: ts.SourceFile): ts.CallExpression | undefined => {
		let result: ts.CallExpression | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isCallExpression(node)) {
				result = node;
				return;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	const findAllCallExpressions = (sourceFile: ts.SourceFile): ts.CallExpression[] => {
		const results: ts.CallExpression[] = [];
		const visit = (node: ts.Node): void => {
			if (ts.isCallExpression(node)) {
				results.push(node);
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return results;
	};

	const findLastCallExpression = (sourceFile: ts.SourceFile): ts.CallExpression | undefined => {
		const calls = findAllCallExpressions(sourceFile);
		return calls[calls.length - 1];
	};

	beforeEach(() => {
		extractor = new CvaExtractor();
	});

	describe('canHandle', () => {
		it('should return true for call expressions', () => {
			const code = "import { cva } from 'class-variance-authority'; cva('flex');";
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			expect(extractor.canHandle(callExpr, context)).toBe(true);
		});

		it('should return false for non-call expressions', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);

			expect(extractor.canHandle(context.sourceFile.statements[0], context)).toBe(false);
		});
	});

	describe('extract - type guards', () => {
		it('should return empty array for non-call expression node', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);

			const classes = extractor.extract(context.sourceFile.statements[0], context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - basic cva calls', () => {
		it('should extract classes from cva base string', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex items-center');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract classes from cva base array', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva(['flex', 'items-center', 'justify-center']);
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('justify-center');
		});

		it('should return empty array when no cva import', () => {
			const code = `
				const button = cva('flex items-center');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array for cva call with no arguments', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva();
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - cva variants', () => {
		it('should extract classes from variants object', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						intent: {
							primary: 'bg-blue-500 text-white',
							secondary: 'bg-gray-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base');
			expect(classes.map(c => c.className)).toContain('bg-blue-500');
			expect(classes.map(c => c.className)).toContain('text-white');
			expect(classes.map(c => c.className)).toContain('bg-gray-500');
		});

		it('should extract classes from variant arrays', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						size: {
							sm: ['text-sm', 'py-1', 'px-2'],
							lg: ['text-lg', 'py-3', 'px-4']
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('text-sm');
			expect(classes.map(c => c.className)).toContain('py-1');
			expect(classes.map(c => c.className)).toContain('text-lg');
			expect(classes.map(c => c.className)).toContain('py-3');
		});

		it('should handle boolean variants with true/false keys', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						disabled: {
							true: 'opacity-50 cursor-not-allowed',
							false: 'cursor-pointer'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('opacity-50');
			expect(classes.map(c => c.className)).toContain('cursor-not-allowed');
			expect(classes.map(c => c.className)).toContain('cursor-pointer');
		});

		it('should handle null variant values', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						intent: {
							primary: 'bg-blue-500',
							none: null
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('bg-blue-500');
			// null should be skipped
			expect(classes.map(c => c.className)).not.toContain('null');
		});

		it('should handle non-object variant initializers', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: 'not-an-object'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('extract - compoundVariants', () => {
		it('should extract classes from compoundVariants with class property', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						intent: { primary: 'bg-blue-500' }
					},
					compoundVariants: [
						{
							intent: 'primary',
							class: 'font-bold uppercase'
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('font-bold');
			expect(classes.map(c => c.className)).toContain('uppercase');
		});

		it('should extract classes from compoundVariants with className property', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					compoundVariants: [
						{
							intent: 'primary',
							className: 'shadow-lg'
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('shadow-lg');
		});

		it('should handle compoundVariants with array values', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					compoundVariants: [
						{
							intent: 'primary',
							class: ['font-bold', 'uppercase']
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('font-bold');
			expect(classes.map(c => c.className)).toContain('uppercase');
		});

		it('should handle non-array compoundVariants', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					compoundVariants: 'not-an-array'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('extract - defaultVariants', () => {
		it('should skip defaultVariants property', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						intent: { primary: 'bg-blue-500' }
					},
					defaultVariants: {
						intent: 'primary'
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Should not include 'primary' as a class (it's a variant value, not a class)
			expect(classes.map(c => c.className)).not.toContain('primary');
		});
	});

	describe('extract - import aliasing', () => {
		it('should handle aliased imports', () => {
			const code = `
				import { cva as createVariants } from 'class-variance-authority';
				const button = createVariants('flex items-center');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle member expression calls', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const utils = { cva };
				const button = utils.cva('flex items-center');
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			// Find the utils.cva call
			const cvaCall = calls.find(c => c.getText().includes('utils.cva'));

			if (cvaCall) {
				const classes = extractor.extract(cvaCall, context);
				expect(classes.map(c => c.className)).toContain('flex');
			}
		});
	});

	describe('extract - template literals', () => {
		it('should extract classes from no-substitution template literal', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva(\`flex items-center\`);
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract static parts from template expression', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const dynamic = 'test';
				const button = cva(\`flex \${dynamic} items-center\`);
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const cvaCall = calls.find(c => c.getText().includes('cva('));

			if (cvaCall) {
				const classes = extractor.extract(cvaCall, context);
				expect(classes.map(c => c.className)).toContain('flex');
				expect(classes.map(c => c.className)).toContain('items-center');
			}
		});
	});

	describe('extract - expression types in values', () => {
		it('should extract from ternary expression in base', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const condition = true;
				const button = cva(condition ? 'flex' : 'block');
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const cvaCall = calls.find(c => c.getText().includes('cva('));

			if (cvaCall) {
				const classes = extractor.extract(cvaCall, context);
				expect(classes.map(c => c.className)).toContain('flex');
				expect(classes.map(c => c.className)).toContain('block');
			}
		});

		it('should extract from binary expression (logical AND)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const condition = true;
				const button = cva(condition && 'flex');
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const cvaCall = calls.find(c => c.getText().includes('cva('));

			if (cvaCall) {
				const classes = extractor.extract(cvaCall, context);
				expect(classes.map(c => c.className)).toContain('flex');
			}
		});

		it('should extract from parenthesized expression', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva(('flex items-center'));
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from as expression', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex items-center' as string);
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from non-null expression', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const maybeClasses = 'flex items-center';
				const button = cva(maybeClasses!);
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const cvaCall = calls.find(c => c.getText().includes('cva('));

			// Should not crash
			expect(() => {
				if (cvaCall) extractor.extract(cvaCall, context);
			}).not.toThrow();
		});
	});

	describe('extract - array with expressions', () => {
		it('should extract from array with ternary expressions', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const condition = true;
				const button = cva(['flex', condition ? 'visible' : 'hidden']);
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const cvaCall = calls.find(c => c.getText().includes('cva('));

			if (cvaCall) {
				const classes = extractor.extract(cvaCall, context);
				expect(classes.map(c => c.className)).toContain('flex');
				expect(classes.map(c => c.className)).toContain('visible');
				expect(classes.map(c => c.className)).toContain('hidden');
			}
		});
	});

	describe('extract - isVariant marking', () => {
		it('should mark base classes without isVariant', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base-class', {
					variants: {
						intent: {
							primary: 'variant-class'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			const baseClass = classes.find(c => c.className === 'base-class');
			const variantClass = classes.find(c => c.className === 'variant-class');

			expect(baseClass?.isVariant).toBeFalsy();
			expect(variantClass?.isVariant).toBe(true);
		});

		it('should mark compoundVariant classes with isVariant', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					compoundVariants: [
						{ intent: 'primary', class: 'compound-class' }
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			const compoundClass = classes.find(c => c.className === 'compound-class');
			expect(compoundClass?.isVariant).toBe(true);
		});
	});

	describe('extract - attributeId', () => {
		it('should set attributeId for all classes', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex items-center');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes[0].attributeId).toBeDefined();
			expect(classes[0].attributeId).toMatch(/^cva:\d+-\d+$/);
			expect(classes[0].attributeId).toBe(classes[1].attributeId);
		});
	});

	describe('extract - property name handling', () => {
		it('should handle string literal property names', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					'variants': {
						'intent': {
							'primary': 'bg-blue-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('bg-blue-500');
		});
	});

	describe('extract - config object validation', () => {
		it('should handle non-object config argument', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', 'not-an-object');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base');
		});

		it('should handle spread elements in config', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					...otherConfig,
					variants: { intent: { primary: 'bg-blue-500' } }
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash on spread elements
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('caching', () => {
		it('should cache import detection results', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Call twice to test caching
			extractor.extract(callExpr, context);
			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should clear cache when clearCache is called', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			extractor.extract(callExpr, context);
			extractor.clearCache();

			// Should still work after cache clear
			const classes = extractor.extract(callExpr, context);
			expect(classes.map(c => c.className)).toContain('flex');
		});
	});

	describe('edge cases', () => {
		it('should return empty array for non-cva call expression', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const x = otherFunction('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle import without import clause', () => {
			const code = `
				import 'class-variance-authority';
				const button = cva('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle empty variants object', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', { variants: {} });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base');
		});

		it('should handle unknown config properties', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					unknownProp: 'some-class'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Unknown props are processed as potential class containers
			expect(classes.map(c => c.className)).toContain('some-class');
		});
	});

	describe('extract with TypeChecker - cva function calls', () => {
		it('should extract class from cva-created function call with class property', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base-class', {
					variants: {
						intent: {
							primary: 'bg-blue-500'
						}
					}
				});
				const result = button({ intent: 'primary', class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('extra-class');
		});

		it('should extract class from cva-created function call with className property', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base-class');
				const result = button({ className: 'override-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('override-class');
		});

		it('should extract multiple classes from cva function call', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result = button({ class: 'flex items-center gap-2' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('gap-2');
		});

		it('should return empty array when cva function call has no arguments', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result = button();
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array when cva function call arg is not object literal', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const options = { class: 'flex' };
				const result = button(options);
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Variable reference - can't extract without resolving
			expect(classes).toHaveLength(0);
		});

		it('should skip utility functions even with TypeChecker', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result = button({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code, {
				utilityFunctions: ['button']
			});
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// button is marked as utility function, should not extract
			expect(classes).toHaveLength(0);
		});

		it('should cache symbol lookup results', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result1 = button({ class: 'flex' });
				const result2 = button({ class: 'grid' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const buttonCall1 = calls[1]; // First button() call
			const buttonCall2 = calls[2]; // Second button() call

			// Both calls should work
			const classes1 = extractor.extract(buttonCall1, context);
			const classes2 = extractor.extract(buttonCall2, context);

			expect(classes1.map(c => c.className)).toContain('flex');
			expect(classes2.map(c => c.className)).toContain('grid');
		});

		it('should set attributeId for cva function call classes', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result = button({ class: 'flex items-center' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes[0].attributeId).toBeDefined();
			expect(classes[0].attributeId).toMatch(/^cva-call:\d+-\d+$/);
		});

		it('should not extract from non-cva function calls', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const notCva = () => {};
				const result = notCva({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle property access expression calls', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const variants = {
					button: cva('base-class')
				};
				const result = variants.button({ class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			// This tests the property access expression path in isCvaCreatedFunctionCall
			// The result depends on whether TypeChecker can resolve the symbol
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should skip non-identifier and non-property-access expressions', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const getButton = () => cva('base');
				const result = getButton()({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const outerCall = calls[calls.length - 1]; // getButton()({ class: 'flex' })

			const classes = extractor.extract(outerCall, context);

			// Call expression as the expression (not identifier) - should return empty
			expect(classes).toHaveLength(0);
		});

		it('should handle symbol without declarations', () => {
			// This is an edge case that's hard to trigger, but we can at least
			// verify the code doesn't crash
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				button({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('extract with TypeChecker - edge cases', () => {
		it('should handle class property with array value', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const result = button({ class: ['flex', 'items-center'] });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should skip non-property-assignment in function call arg', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				const extra = 'flex';
				const result = button({ class: 'grid', extra });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Should only extract 'grid' from class property
			expect(classes.map(c => c.className)).toContain('grid');
		});

		it('should handle aliased cva import with TypeChecker', () => {
			const code = `
				import { cva as createVariant } from 'class-variance-authority';
				const button = createVariant('base-class');
				const result = button({ class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('extra-class');
		});
	});

	describe('100% coverage - edge cases', () => {
		it('should return false for cva call with call expression (not identifier/property access)', () => {
			// Line 88: return false when expression is neither identifier nor property access
			const code = `
				import { cva } from 'class-variance-authority';
				const getCva = () => cva;
				const button = getCva()('base-class');
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			// getCva()('base-class') - the outer call has a call expression as its expression
			const outerCall = calls[calls.length - 1];

			const classes = extractor.extract(outerCall, context);

			// Should not match as cva call since expression is a call expression
			expect(classes).toHaveLength(0);
		});

		it('should skip computed property names in config (line 197)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const prop = 'variants';
				const button = cva('base', { [prop]: { size: { sm: 'text-sm' } } });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Base class should be extracted, but computed property is skipped
			expect(classes.map(c => c.className)).toContain('base');
		});

		it('should skip shorthand properties in variants (line 246)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const size = { sm: 'text-sm' };
				const button = cva('base', { variants: { size } });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Only base should be extracted
			expect(classes.map(c => c.className)).toContain('base');
		});

		it('should skip spread in variant options (line 254)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const options = { sm: 'text-sm' };
				const button = cva('base', {
					variants: {
						size: {
							...options,
							lg: 'text-lg'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base');
			expect(classes.map(c => c.className)).toContain('text-lg');
		});

		it('should skip non-object elements in compoundVariants (line 296)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					compoundVariants: [
						'not-an-object',
						{ intent: 'primary', class: 'font-bold' }
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base');
			expect(classes.map(c => c.className)).toContain('font-bold');
		});

		it('should skip spread in compoundVariants properties (line 302)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const conditions = { intent: 'primary' };
				const button = cva('base', {
					compoundVariants: [
						{
							...conditions,
							class: 'font-bold'
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('font-bold');
		});

		it('should handle identifier in extractFromValue (lines 340-341)', () => {
			// This tests the identifier branch in extractFromValue
			const code = `
				import { cva } from 'class-variance-authority';
				const myBase = 'flex items-center';
				const button = cva(myBase);
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Without TypeChecker, variable references won't be resolved
			// but the code path should be hit
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle identifier in array (lines 355-357)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const extraClass = 'extra';
				const button = cva(['flex', extraClass, 'items-center']);
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle return [] at end of extractFromValue (line 461)', () => {
			// This tests when node doesn't match any known expression type
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						size: {
							sm: someFunction()
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// someFunction() is a CallExpression which isn't handled in extractFromValue
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should return false when symbol has no declarations (line 525)', () => {
			// This is hard to trigger directly, but we can test through a function
			// that references something TypeChecker can't resolve
			const code = `
				import { cva } from 'class-variance-authority';
				declare const button: ReturnType<typeof cva>;
				const result = button({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			// Should not crash even if symbol resolution is tricky
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should return null for numeric literal property name (line 610)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base', {
					variants: {
						size: {
							100: 'text-xs'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Numeric keys should still work (they're treated as identifiers)
			expect(classes.map(c => c.className)).toContain('base');
			expect(classes.map(c => c.className)).toContain('text-xs');
		});

		it('should handle export default cva pattern (lines 541-544)', () => {
			// Export assignments are a specific declaration type
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva('base');
				export default button;
				const result = button({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should return false when TypeChecker returns no symbol (line 503)', () => {
			// Create a scenario where getSymbolAtLocation returns undefined
			const code = `
				import { cva } from 'class-variance-authority';
				const result = undefinedFunction({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle non-identifier/non-property-access in isCvaCreatedFunctionCall (line 486)', () => {
			// When the call expression is something like fn()()
			const code = `
				import { cva } from 'class-variance-authority';
				const getVariant = () => cva('base');
				const result = getVariant()({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			// The outer call getVariant()({ class: 'flex' }) has call expression as its expression
			const outerCall = calls[calls.length - 1];

			const classes = extractor.extract(outerCall, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle type assertion expression in .ts file', () => {
			// Create context with .ts extension to test isTypeAssertionExpression
			const fileName = '/test.ts';
			const code = `
				import { cva } from 'class-variance-authority';
				const button = cva(<string>'base-class');
			`;

			const files: Record<string, string> = {
				[fileName]: code,
				'/node_modules/class-variance-authority/index.d.ts': `
					export declare function cva<T>(base?: string, config?: T): (...args: any[]) => string;
				`
			};

			const compilerHost: ts.CompilerHost = {
				getSourceFile: (name: string, languageVersion: ts.ScriptTarget) => {
					const content = files[name];
					if (content !== undefined) {
						return ts.createSourceFile(name, content, languageVersion, true,
							name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
					}
					return undefined;
				},
				getDefaultLibFileName: () => '/lib.d.ts',
				writeFile: () => {},
				getCurrentDirectory: () => '/',
				getCanonicalFileName: (f: string) => f,
				useCaseSensitiveFileNames: () => true,
				getNewLine: () => '\n',
				fileExists: (name: string) => name in files,
				readFile: (name: string) => files[name],
				directoryExists: () => true,
				getDirectories: () => []
			};

			const program = ts.createProgram([fileName], {
				target: ts.ScriptTarget.Latest,
				module: ts.ModuleKind.ESNext,
				strict: true,
				moduleResolution: ts.ModuleResolutionKind.NodeJs
			}, compilerHost);

			const sourceFile = program.getSourceFile(fileName)!;
			const context: ExtractionContext = {
				typescript: ts,
				sourceFile,
				typeChecker: program.getTypeChecker(),
				utilityFunctions: []
			};

			const callExpr = findCallExpression(sourceFile)!;
			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base-class');
		});

		it('should return false in isCvaCall for element access expression (line 88)', () => {
			// Element access expression like cvaFunctions['default']() is neither identifier nor property access
			const code = `
				import { cva } from 'class-variance-authority';
				const cvaFunctions = { default: cva };
				const button = cvaFunctions['default']('base-class');
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			// cvaFunctions['default']('base-class') has element access expression
			const lastCall = calls[calls.length - 1];

			const classes = extractor.extract(lastCall, context);

			// Element access expressions return false in isCvaCall
			expect(classes).toHaveLength(0);
		});

		it('should handle identifier variable reference in array with TypeChecker (line 357)', () => {
			const code = `
				import { cva } from 'class-variance-authority';
				const myClass = 'my-custom-class';
				const button = cva(['flex', myClass, 'items-center']);
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// With TypeChecker, we might be able to resolve some variable references
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle export default with direct cva call', () => {
			// Test export default cva(...) pattern
			const code = `
				import { cva } from 'class-variance-authority';
				export default cva('exported-base');
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('exported-base');
		});
	});
});
