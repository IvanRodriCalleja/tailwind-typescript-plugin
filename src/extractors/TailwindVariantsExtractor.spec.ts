import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { TailwindVariantsExtractor } from './TailwindVariantsExtractor';

describe('TailwindVariantsExtractor', () => {
	let extractor: TailwindVariantsExtractor;

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
			// Add a minimal tv type declaration
			'/node_modules/tailwind-variants/index.d.ts': `
				export declare function tv<T>(config?: T): (...args: any[]) => string;
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
		const program = ts.createProgram(
			[fileName],
			{
				target: ts.ScriptTarget.Latest,
				module: ts.ModuleKind.ESNext,
				jsx: ts.JsxEmit.React,
				strict: true,
				moduleResolution: ts.ModuleResolutionKind.NodeJs
			},
			compilerHost
		);

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
		extractor = new TailwindVariantsExtractor();
	});

	describe('canHandle', () => {
		it('should return true for call expressions', () => {
			const code = "import { tv } from 'tailwind-variants'; tv({ base: 'flex' });";
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

	describe('extract - basic tv calls', () => {
		it('should extract classes from tv base string', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract classes from tv base array', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: ['flex', 'items-center', 'justify-center'] });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('justify-center');
		});

		it('should return empty array when no tv import', () => {
			const code = `
				const button = tv({ base: 'flex items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - tv variants', () => {
		it('should extract classes from variants object', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'base-class',
					variants: {
						color: {
							primary: 'bg-blue-500 text-white',
							secondary: 'bg-gray-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base-class');
			expect(classes.map(c => c.className)).toContain('bg-blue-500');
			expect(classes.map(c => c.className)).toContain('text-white');
			expect(classes.map(c => c.className)).toContain('bg-gray-500');
		});

		it('should extract classes from variant arrays', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
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

		it('should handle boolean variants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
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
	});

	describe('extract - compoundVariants', () => {
		it('should extract classes from compoundVariants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						color: { primary: 'bg-blue-500' }
					},
					compoundVariants: [
						{
							color: 'primary',
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
				import { tv } from 'tailwind-variants';
				const button = tv({
					compoundVariants: [
						{
							color: 'primary',
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
	});

	describe('extract - slots', () => {
		it('should extract classes from slots', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						base: 'flex flex-col',
						header: 'font-bold text-lg',
						body: 'p-4',
						footer: 'border-t'
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('flex-col');
			expect(classes.map(c => c.className)).toContain('font-bold');
			expect(classes.map(c => c.className)).toContain('p-4');
			expect(classes.map(c => c.className)).toContain('border-t');
		});

		it('should extract classes from slot arrays', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						base: ['flex', 'flex-col', 'gap-4']
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('flex-col');
			expect(classes.map(c => c.className)).toContain('gap-4');
		});
	});

	describe('extract - import variations', () => {
		it('should handle aliased imports', () => {
			const code = `
				import { tv as createVariants } from 'tailwind-variants';
				const button = createVariants({ base: 'flex items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle lite version import', () => {
			const code = `
				import { tv } from 'tailwind-variants/lite';
				const button = tv({ base: 'flex items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('caching', () => {
		it('should cache import detection results', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
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
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
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
		it('should return empty array for non-tv call expression', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const x = otherFunction({ base: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array for tv call with no arguments', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv();
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array for tv call with non-object argument', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv('not-an-object');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle empty variants object', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'base-class', variants: {} });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('base-class');
		});

		it('should handle null variant values', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						color: {
							primary: 'bg-blue-500',
							none: null
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should mark variant classes with isVariant', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'base-class',
					variants: {
						color: {
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

			// Base classes should not be marked as variants
			expect(baseClass?.isVariant).toBeFalsy();
			// Variant classes should be marked
			expect(variantClass?.isVariant).toBe(true);
		});

		it('should set attributeId for duplicate detection', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes[0].attributeId).toBeDefined();
			expect(classes[0].attributeId).toMatch(/^tv:\d+-\d+$/);
			// All classes from same tv() call should have same attributeId
			expect(classes[0].attributeId).toBe(classes[1].attributeId);
		});
	});

	describe('extract - type guards', () => {
		it('should return empty array for non-call-expression nodes', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const x = 'flex';
			`;
			const context = createContext(code);

			// Pass a non-call-expression node
			const classes = extractor.extract(context.sourceFile.statements[1], context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - member expression tv calls', () => {
		it('should handle property access expression for tv', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const utils = { tv };
				const button = utils.tv({ base: 'flex items-center' });
			`;
			const context = createContext(code);

			// Find the last call expression (utils.tv(...))
			const callExpressions: ts.CallExpression[] = [];
			const visit = (node: ts.Node): void => {
				if (ts.isCallExpression(node)) {
					callExpressions.push(node);
				}
				ts.forEachChild(node, visit);
			};
			visit(context.sourceFile);

			const callExpr = callExpressions[callExpressions.length - 1];
			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - template expressions', () => {
		it('should extract from no-substitution template literal', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: \`flex items-center\` });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract static parts from template expression with substitutions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const color = 'blue';
				const button = tv({ base: \`flex \${color} items-center\` });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from template expression head', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: \`static-head \${dynamic}\` });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('static-head');
		});

		it('should extract from template spans', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: \`\${first} middle-span \${second} end-span\` });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('middle-span');
			expect(classes.map(c => c.className)).toContain('end-span');
		});
	});

	describe('extract - expression types in values', () => {
		it('should extract from ternary expressions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						active: {
							true: condition ? 'bg-blue-500' : 'bg-gray-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('bg-blue-500');
			expect(classes.map(c => c.className)).toContain('bg-gray-500');
		});

		it('should extract from binary expressions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						active: {
							true: active && 'bg-blue-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('bg-blue-500');
		});

		it('should extract from parenthesized expressions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						size: {
							sm: ('text-sm py-1')
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('text-sm');
			expect(classes.map(c => c.className)).toContain('py-1');
		});

		it('should extract from as expressions (type assertions)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						size: {
							sm: 'text-sm py-1' as string
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('text-sm');
			expect(classes.map(c => c.className)).toContain('py-1');
		});

		it('should extract from non-null assertions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const maybeClass = 'flex items-center';
				const button = tv({
					base: maybeClass!
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Without typeChecker, this will not extract from the variable
			// but should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle angle bracket syntax (treated as JSX in TSX files)', () => {
			// Note: In TSX files, angle bracket type assertions <T>value
			// are interpreted as JSX elements, not type assertions.
			// The isTypeAssertionExpression check won't match in TSX.
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						size: {
							sm: 'text-sm py-1' as const
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('text-sm');
			expect(classes.map(c => c.className)).toContain('py-1');
		});
	});

	describe('extract - array values with expressions', () => {
		it('should extract from arrays with ternary expressions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: ['flex', condition ? 'visible' : 'hidden']
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('visible');
			expect(classes.map(c => c.className)).toContain('hidden');
		});
	});

	describe('extract - property names', () => {
		it('should handle string literal property names', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					'base': 'flex',
					'variants': {
						'color': {
							'primary': 'bg-blue-500'
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('bg-blue-500');
		});
	});

	describe('extract - slots with nested config', () => {
		it('should extract from slots with nested base and variants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						root: {
							base: 'flex flex-col',
							variants: {
								size: {
									sm: 'p-2',
									lg: 'p-4'
								}
							}
						}
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('flex-col');
			expect(classes.map(c => c.className)).toContain('p-2');
			expect(classes.map(c => c.className)).toContain('p-4');
		});
	});

	describe('extract - defaultVariants', () => {
		it('should skip defaultVariants (no classes there)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex',
					variants: {
						color: {
							primary: 'bg-blue-500'
						}
					},
					defaultVariants: {
						color: 'primary'
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// defaultVariants contains 'primary' which is not a class
			expect(classes.map(c => c.className)).not.toContain('primary');
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('bg-blue-500');
		});
	});

	describe('extract - unknown properties', () => {
		it('should try to extract from unknown properties', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex',
					customProperty: 'custom-class'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('custom-class');
		});
	});

	describe('extract - compoundVariants edge cases', () => {
		it('should handle compoundVariants with array values', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					compoundVariants: [
						{
							color: 'primary',
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

		it('should skip non-class properties in compoundVariants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					compoundVariants: [
						{
							color: 'primary',
							size: 'sm',
							class: 'font-bold'
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// 'primary' and 'sm' should not be extracted as classes
			expect(classes.map(c => c.className)).not.toContain('primary');
			expect(classes.map(c => c.className)).not.toContain('sm');
			expect(classes.map(c => c.className)).toContain('font-bold');
		});

		it('should return empty for non-array compoundVariants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					compoundVariants: 'not-an-array'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle empty compoundVariants array', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex',
					compoundVariants: []
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should mark compoundVariants classes with isVariant', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'base-class',
					compoundVariants: [
						{
							class: 'compound-class'
						}
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			const baseClass = classes.find(c => c.className === 'base-class');
			const compoundClass = classes.find(c => c.className === 'compound-class');

			expect(baseClass?.isVariant).toBeFalsy();
			expect(compoundClass?.isVariant).toBe(true);
		});
	});

	describe('extract - variants edge cases', () => {
		it('should return empty for non-object variants', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: 'not-an-object'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle variant values that are not objects', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					variants: {
						color: 'not-an-object-value'
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('extract - slots edge cases', () => {
		it('should return empty for non-object slots', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: 'not-an-object'
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle slot with array value', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						base: ['flex', 'flex-col']
					}
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('flex-col');
		});
	});

	describe('import detection', () => {
		it('should not detect non-tailwind-variants imports', () => {
			const code = `
				import { tv } from 'some-other-library';
				const button = tv({ base: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should not detect default imports', () => {
			const code = `
				import tv from 'tailwind-variants';
				const button = tv({ base: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Default imports are not supported, only named imports
			expect(classes).toHaveLength(0);
		});

		it('should skip imports without import clause', () => {
			const code = `
				import 'tailwind-variants';
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should skip namespace imports', () => {
			const code = `
				import * as tvLib from 'tailwind-variants';
				const button = tvLib.tv({ base: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Namespace imports are not supported in the same way
			expect(classes).toHaveLength(0);
		});
	});

	describe('non-property-assignment in config', () => {
		it('should skip shorthand properties in config', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const base = 'flex';
				const button = tv({ base, other: 'items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Shorthand is NOT a PropertyAssignment, so 'flex' won't be extracted
			// But 'other' is a regular PropertyAssignment
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should skip spread properties in config', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const config = { base: 'flex' };
				const button = tv({ ...config, other: 'items-center' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			// Spread assignment is not handled, but regular properties are
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('property name edge cases', () => {
		it('should return null for computed property names', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const propName = 'base';
				const button = tv({ [propName]: 'flex' });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			// Computed property names return null from getPropertyName
			// so no classes should be extracted
			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});
	});

	describe('extract with TypeChecker - tv function calls', () => {
		it('should extract class from tv-created function call with class property', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'base-class',
					variants: {
						color: {
							primary: 'bg-blue-500'
						}
					}
				});
				const result = button({ color: 'primary', class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('extra-class');
		});

		it('should extract class from tv-created function call with className property', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'base-class' });
				const result = button({ className: 'override-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('override-class');
		});

		it('should extract multiple classes from tv function call', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result = button({ class: 'items-center gap-2' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('gap-2');
		});

		it('should return empty array when tv function call has no arguments', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result = button();
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array when tv function call arg is not object literal', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const options = { class: 'flex' };
				const result = button(options);
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should skip utility functions even with TypeChecker', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result = button({ class: 'grid' });
			`;
			const context = createContextWithTypeChecker(code, {
				utilityFunctions: ['button']
			});
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should cache symbol lookup results', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result1 = button({ class: 'grid' });
				const result2 = button({ class: 'block' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const buttonCall1 = calls[1];
			const buttonCall2 = calls[2];

			const classes1 = extractor.extract(buttonCall1, context);
			const classes2 = extractor.extract(buttonCall2, context);

			expect(classes1.map(c => c.className)).toContain('grid');
			expect(classes2.map(c => c.className)).toContain('block');
		});

		it('should set attributeId for tv function call classes', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result = button({ class: 'items-center' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes[0].attributeId).toBeDefined();
			expect(classes[0].attributeId).toMatch(/^tv-call:\d+-\d+$/);
		});

		it('should not extract from non-tv function calls', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const notTv = () => {};
				const result = notTv({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle property access expression calls', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const variants = {
					button: tv({ base: 'base-class' })
				};
				const result = variants.button({ class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should skip non-identifier and non-property-access expressions', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const getButton = () => tv({ base: 'flex' });
				const result = getButton()({ class: 'grid' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const outerCall = calls[calls.length - 1];

			const classes = extractor.extract(outerCall, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract with TypeChecker - edge cases', () => {
		it('should handle class property with array value', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const result = button({ class: ['grid', 'gap-4'] });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('grid');
			expect(classes.map(c => c.className)).toContain('gap-4');
		});

		it('should skip non-property-assignment in function call arg', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				const extra = 'items-center';
				const result = button({ class: 'grid', extra });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('grid');
		});

		it('should handle aliased tv import with TypeChecker', () => {
			const code = `
				import { tv as createVariants } from 'tailwind-variants';
				const button = createVariants({ base: 'base-class' });
				const result = button({ class: 'extra-class' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('extra-class');
		});

		it('should handle slots with TypeChecker', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const card = tv({
					slots: {
						base: 'flex flex-col',
						header: 'font-bold'
					}
				});
				const { base, header } = card();
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const tvCall = calls[0]; // The tv() call

			const classes = extractor.extract(tvCall, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('flex-col');
			expect(classes.map(c => c.className)).toContain('font-bold');
		});
	});

	describe('100% coverage - edge cases', () => {
		it('should return false in isTvCall for element access expression (line 105)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const tvFunctions = { default: tv };
				const button = tvFunctions['default']({ base: 'flex' });
			`;
			const context = createContext(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const lastCall = calls[calls.length - 1];

			const classes = extractor.extract(lastCall, context);

			expect(classes).toHaveLength(0);
		});

		it('should skip shorthand properties in variants (line 248)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const size = { sm: 'text-sm' };
				const button = tv({ base: 'flex', variants: { size } });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should skip spread in variant options (line 256)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const options = { sm: 'text-sm' };
				const button = tv({
					base: 'flex',
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

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('text-lg');
		});

		it('should skip non-object elements in compoundVariants (line 288)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({
					base: 'flex',
					compoundVariants: [
						'not-an-object',
						{ color: 'primary', class: 'font-bold' }
					]
				});
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('font-bold');
		});

		it('should skip spread in compoundVariants properties (line 294)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const conditions = { color: 'primary' };
				const button = tv({
					base: 'flex',
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

		it('should skip shorthand properties in slots (line 326)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const base = 'flex';
				const card = tv({ slots: { base, header: 'font-bold' } });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('font-bold');
		});

		it('should handle identifier in extractFromValue (lines 371-372)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const myBase = 'flex items-center';
				const button = tv({ base: myBase });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle identifier in array (lines 386-388)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const extraClass = 'extra';
				const button = tv({ base: ['flex', extraClass, 'items-center'] });
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle type assertion in .ts file (lines 488-489)', () => {
			const fileName = '/test.ts';
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: <string>'base-class' });
			`;

			const files: Record<string, string> = {
				[fileName]: code,
				'/node_modules/tailwind-variants/index.d.ts': `
					export declare function tv<T>(config?: T): (...args: any[]) => string;
				`
			};

			const compilerHost: ts.CompilerHost = {
				getSourceFile: (name: string, languageVersion: ts.ScriptTarget) => {
					const content = files[name];
					if (content !== undefined) {
						return ts.createSourceFile(
							name,
							content,
							languageVersion,
							true,
							name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
						);
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

			const program = ts.createProgram(
				[fileName],
				{
					target: ts.ScriptTarget.Latest,
					module: ts.ModuleKind.ESNext,
					strict: true,
					moduleResolution: ts.ModuleResolutionKind.NodeJs
				},
				compilerHost
			);

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

		it('should handle non-identifier/non-property-access in isTvCreatedFunctionCall (line 537)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const getVariant = () => tv({ base: 'flex' });
				const result = getVariant()({ class: 'grid' });
			`;
			const context = createContextWithTypeChecker(code);
			const calls = findAllCallExpressions(context.sourceFile);
			const outerCall = calls[calls.length - 1];

			const classes = extractor.extract(outerCall, context);

			expect(classes).toHaveLength(0);
		});

		it('should return false when TypeChecker returns no symbol (line 554)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const result = undefinedFunction({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes).toHaveLength(0);
		});

		it('should return false when symbol has no declarations (line 576)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				declare const button: ReturnType<typeof tv>;
				const result = button({ class: 'flex' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			expect(() => extractor.extract(callExpr, context)).not.toThrow();
		});

		it('should handle export default tv pattern (lines 592-595)', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const button = tv({ base: 'flex' });
				export default button;
				const result = button({ class: 'grid' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findLastCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('grid');
		});

		it('should handle identifier variable reference in array with TypeChecker', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				const myClass = 'my-custom-class';
				const button = tv({ base: ['flex', myClass, 'items-center'] });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle export default with direct tv call', () => {
			const code = `
				import { tv } from 'tailwind-variants';
				export default tv({ base: 'exported-base' });
			`;
			const context = createContextWithTypeChecker(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const classes = extractor.extract(callExpr, context);

			expect(classes.map(c => c.className)).toContain('exported-base');
		});
	});
});
