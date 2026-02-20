import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { TemplateExpressionExtractor } from './TemplateExpressionExtractor';

describe('TemplateExpressionExtractor', () => {
	let extractor: TemplateExpressionExtractor;

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

	const findTemplateExpression = (
		sourceFile: ts.SourceFile
	): ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral | undefined => {
		let result: ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
				result = node;
				return;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	beforeEach(() => {
		extractor = new TemplateExpressionExtractor();
	});

	describe('canHandle', () => {
		it('should return true for template expression', () => {
			const code = 'const x = `flex ${dynamic}`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			expect(extractor.canHandle(expr, context)).toBe(true);
		});

		it('should return true for no-substitution template literal', () => {
			const code = 'const x = `flex items-center`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			expect(extractor.canHandle(expr, context)).toBe(true);
		});

		it('should return false for regular string literal', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);

			expect(extractor.canHandle(context.sourceFile.statements[0], context)).toBe(false);
		});
	});

	describe('extract - no substitution template literals', () => {
		it('should extract single class from template literal', () => {
			const code = 'const x = `flex`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract multiple classes from template literal', () => {
			const code = 'const x = `flex items-center justify-between`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center', 'justify-between']);
		});

		it('should return empty array for empty template literal', () => {
			const code = 'const x = ``;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - template expressions with substitutions', () => {
		it('should extract static classes before substitution', () => {
			const code = 'const x = `flex ${dynamic}`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should extract static classes after substitution', () => {
			const code = 'const x = `${dynamic} items-center`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract static classes before and after substitution', () => {
			const code = 'const x = `flex ${dynamic} items-center`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should extract from string literal in substitution', () => {
			const code = "const x = `flex ${'items-center'}`;";
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});

		it('should handle multiple substitutions', () => {
			const code = 'const x = `flex ${first} items-center ${second} justify-between`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('justify-between');
		});

		it('should extract from ternary expressions in substitution', () => {
			const code = "const x = `flex ${active ? 'visible' : 'hidden'}`;";
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('visible');
			expect(classes.map(c => c.className)).toContain('hidden');
		});

		it('should extract from logical AND in substitution', () => {
			const code = "const x = `flex ${active && 'items-center'}`;";
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('position tracking', () => {
		it('should set correct absoluteStart for static classes', () => {
			const code = 'const x = `flex items-center`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(
				context.sourceFile.text.substring(
					classes[0].absoluteStart,
					classes[0].absoluteStart + classes[0].length
				)
			).toBe('flex');
			expect(
				context.sourceFile.text.substring(
					classes[1].absoluteStart,
					classes[1].absoluteStart + classes[1].length
				)
			).toBe('items-center');
		});

		it('should set correct line number', () => {
			const code = 'const x = `flex`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes[0].line).toBe(1);
		});

		it('should set correct file name', () => {
			const code = 'const x = `flex`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes[0].file).toBe('test.tsx');
		});
	});

	describe('edge cases', () => {
		it('should handle substitution at the start', () => {
			const code = 'const x = `${dynamic}flex`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should handle substitution at the end', () => {
			const code = 'const x = `flex${dynamic}`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('flex');
		});

		it('should handle adjacent substitutions', () => {
			const code = 'const x = `${first}${second}`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(expr, context)).not.toThrow();
		});

		it('should handle template with only substitutions', () => {
			const code = 'const x = `${dynamic}`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			// Should not crash
			expect(() => extractor.extract(expr, context)).not.toThrow();
		});

		it('should handle multiple spaces between classes', () => {
			const code = 'const x = `flex    items-center`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			// Note: Current implementation uses split(' ') which may create empty entries
			const classNames = classes.map(c => c.className).filter(c => c);
			expect(classNames).toContain('flex');
			expect(classNames).toContain('items-center');
		});

		it('should handle special characters in class names', () => {
			const code = 'const x = `w-1/2 -mt-4 hover:bg-blue-500`;';
			const context = createContext(code);
			const expr = findTemplateExpression(context.sourceFile)!;

			const classes = extractor.extract(expr, context);

			expect(classes.map(c => c.className)).toContain('w-1/2');
			expect(classes.map(c => c.className)).toContain('-mt-4');
			expect(classes.map(c => c.className)).toContain('hover:bg-blue-500');
		});
	});
});
