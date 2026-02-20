import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { ExpressionExtractor } from './ExpressionExtractor';

describe('ExpressionExtractor', () => {
	let extractor: ExpressionExtractor;

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
			utilities: {},
			...overrides
		};
	};

	const findExpression = (sourceFile: ts.SourceFile): ts.Expression | undefined => {
		let result: ts.Expression | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isVariableDeclaration(node) && node.initializer) {
				result = node.initializer;
				return;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	beforeEach(() => {
		extractor = new ExpressionExtractor();
	});

	describe('canHandle', () => {
		it('should return true for string literal', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			expect(extractor.canHandle(expr, context)).toBe(true);
		});

		it('should return true for expressions', () => {
			const code = "const x = true ? 'flex' : 'block';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			expect(extractor.canHandle(expr, context)).toBe(true);
		});
	});

	describe('extract', () => {
		it('should extract from string literal', () => {
			const code = 'const x = "flex items-center";';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should return empty array for non-expression', () => {
			const code = 'const x = 1;';
			const context = createContext(code);

			// Pass a non-expression node
			const classes = extractor.extract(context.sourceFile, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extractFromExpression - conditional expressions', () => {
		it('should extract from both branches of ternary', () => {
			const code = "const x = true ? 'flex' : 'block';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('block');
		});

		it('should add conditional branch IDs to ternary classes', () => {
			const code = "const x = cond ? 'flex' : 'block';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			const trueClass = classes.find(c => c.className === 'flex');
			const falseClass = classes.find(c => c.className === 'block');

			expect(trueClass?.conditionalBranchId).toMatch(/^ternary:true:\d+$/);
			expect(falseClass?.conditionalBranchId).toMatch(/^ternary:false:\d+$/);
		});

		it('should handle nested ternary expressions', () => {
			const code = "const x = a ? 'flex' : b ? 'block' : 'hidden';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('block');
			expect(classes.map(c => c.className)).toContain('hidden');
		});
	});

	describe('extractFromExpression - binary expressions', () => {
		it('should extract from logical AND expression', () => {
			const code = "const x = active && 'flex';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract from logical OR expression', () => {
			const code = "const x = className || 'default-class';";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('default-class');
		});
	});

	describe('extractFromExpression - call expressions', () => {
		it('should extract from utility function call', () => {
			const code = "const x = clsx('flex', 'items-center');";
			const context = createContext(code, { utilities: { clsx: '*' } });
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should not extract from non-utility function call', () => {
			const code = "const x = unknownFn('flex', 'items-center');";
			const context = createContext(code, { utilities: { clsx: '*' } });
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle nested calls in utility function', () => {
			const code = "const x = clsx('flex', anotherFn('items'));";
			const context = createContext(code, { utilities: { clsx: '*' } });
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});
	});

	describe('extractFromExpression - parenthesized expressions', () => {
		it('should extract from parenthesized string literal', () => {
			const code = "const x = ('flex items-center');";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
		});
	});

	describe('extractFromExpression - type assertions', () => {
		it('should extract from as expression', () => {
			const code = "const x = 'flex items-center' as string;";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
		});

		it('should extract from non-null expression', () => {
			const code = "const x = 'flex items-center'!;";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
		});
	});

	describe('extractFromExpression - array literals', () => {
		it('should extract from array literal elements', () => {
			const code = "const x = ['flex', 'items-center'];";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should handle arrays with conditional elements', () => {
			const code = "const x = ['flex', active ? 'visible' : 'hidden'];";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('visible');
			expect(classes.map(c => c.className)).toContain('hidden');
		});
	});

	describe('extractFromExpression - object literals', () => {
		it('should extract from string literal keys', () => {
			const code = "const x = { 'flex': true, 'items-center': active };";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from identifier keys', () => {
			const code = 'const x = { flex: true, hidden: false };';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('hidden');
		});

		it('should handle shorthand property assignments', () => {
			const code = 'const flex = true; const x = { flex };';
			const context = createContext(code);

			// Get the second variable declaration
			let expr: ts.Expression | undefined;
			const visit = (node: ts.Node): void => {
				if (ts.isVariableDeclaration(node) && node.name.getText() === 'x' && node.initializer) {
					expr = node.initializer;
					return;
				}
				ts.forEachChild(node, visit);
			};
			visit(context.sourceFile);

			const classes = extractor.extractFromExpression(expr!, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should handle computed property names with string literals', () => {
			const code = "const x = { ['flex']: true };";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});
	});

	describe('extractFromExpression - template expressions', () => {
		it('should extract from template expression', () => {
			const code = 'const x = `flex ${dynamic} items-center`;';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from no-substitution template literal', () => {
			const code = 'const x = `flex items-center`;';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});
	});

	describe('conditional branch ID propagation', () => {
		it('should propagate conditional branch ID through nested expressions', () => {
			const code = "const x = active && ('flex items-center');";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context, 'test:branch');

			classes.forEach(c => {
				expect(c.conditionalBranchId).toBe('test:branch');
			});
		});
	});

	describe('edge cases', () => {
		it('should handle empty string literal', () => {
			const code = 'const x = "";';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle empty array literal', () => {
			const code = 'const x = [];';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle empty object literal', () => {
			const code = 'const x = {};';
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle object with value containing classes', () => {
			const code = "const x = { key: ['nested', 'classes'] };";
			const context = createContext(code);
			const expr = findExpression(context.sourceFile)!;

			const classes = extractor.extractFromExpression(expr, context);

			expect(classes.map(c => c.className)).toContain('key');
			expect(classes.map(c => c.className)).toContain('nested');
			expect(classes.map(c => c.className)).toContain('classes');
		});
	});
});
