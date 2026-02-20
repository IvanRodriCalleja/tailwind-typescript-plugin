import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { JsxAttributeExtractor } from './JsxAttributeExtractor';

describe('JsxAttributeExtractor', () => {
	let extractor: JsxAttributeExtractor;

	const createContext = (
		sourceFile: ts.SourceFile,
		overrides: Partial<ExtractionContext> = {}
	): ExtractionContext => ({
		typescript: ts,
		sourceFile,
		utilities: {},
		classAttributes: ['className', 'class', 'classList'],
		...overrides
	});

	const createSourceFile = (code: string): ts.SourceFile => {
		return ts.createSourceFile('test.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	};

	const findJsxElement = (
		sourceFile: ts.SourceFile
	): ts.JsxOpeningElement | ts.JsxSelfClosingElement | undefined => {
		let result: ts.JsxOpeningElement | ts.JsxSelfClosingElement | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
				result = node;
				return;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	beforeEach(() => {
		extractor = new JsxAttributeExtractor();
	});

	describe('canHandle', () => {
		it('should return true for JsxOpeningElement', () => {
			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile);

			expect(element).toBeDefined();
			expect(extractor.canHandle(element!, context)).toBe(true);
		});

		it('should return true for JsxSelfClosingElement', () => {
			const sourceFile = createSourceFile('<img className="block" />');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile);

			expect(element).toBeDefined();
			expect(extractor.canHandle(element!, context)).toBe(true);
		});

		it('should return false for non-JSX nodes', () => {
			const sourceFile = createSourceFile('const x = 1;');
			const context = createContext(sourceFile);

			expect(extractor.canHandle(sourceFile.statements[0], context)).toBe(false);
		});
	});

	describe('extract - string literals', () => {
		it('should extract single class from string literal', () => {
			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract multiple classes from string literal', () => {
			const sourceFile = createSourceFile(
				'<div className="flex items-center justify-between">Hello</div>'
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center', 'justify-between']);
		});

		it('should handle multiple whitespace between classes', () => {
			const sourceFile = createSourceFile('<div className="flex    items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should handle newlines in class string', () => {
			const sourceFile = createSourceFile(`<div className="flex
				items-center
				justify-between">Hello</div>`);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(3);
		});

		it('should handle tabs in class string', () => {
			const sourceFile = createSourceFile('<div className="flex\titems-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});

		it('should return empty array for empty string', () => {
			const sourceFile = createSourceFile('<div className="">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(0);
		});

		it('should set correct absoluteStart for each class', () => {
			const sourceFile = createSourceFile('<div className="flex items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			// First class should start after the opening quote
			expect(
				sourceFile.text.substring(
					classes[0].absoluteStart,
					classes[0].absoluteStart + classes[0].length
				)
			).toBe('flex');
			expect(
				sourceFile.text.substring(
					classes[1].absoluteStart,
					classes[1].absoluteStart + classes[1].length
				)
			).toBe('items-center');
		});
	});

	describe('extract - JSX expressions with string literals', () => {
		it('should extract classes from JSX expression with string literal', () => {
			const sourceFile = createSourceFile("<div className={'flex items-center'}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should extract classes from double-quoted string in expression', () => {
			const sourceFile = createSourceFile('<div className={"flex items-center"}>Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});
	});

	describe('extract - template literals', () => {
		it('should extract static parts from template literal', () => {
			const sourceFile = createSourceFile('<div className={`flex items-center`}>Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should extract classes around template expressions', () => {
			const sourceFile = createSourceFile(
				'<div className={`flex ${dynamic} items-center`}>Hello</div>'
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - ternary expressions', () => {
		it('should extract classes from both ternary branches', () => {
			const sourceFile = createSourceFile("<div className={true ? 'flex' : 'block'}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('block');
		});

		it('should extract multiple classes from ternary branches', () => {
			const sourceFile = createSourceFile(
				"<div className={active ? 'flex items-center' : 'hidden'}>Hello</div>"
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
			expect(classes.map(c => c.className)).toContain('hidden');
		});

		it('should mark classes with conditionalBranchId', () => {
			const sourceFile = createSourceFile("<div className={cond ? 'flex' : 'block'}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			const trueClass = classes.find(c => c.className === 'flex');
			const falseClass = classes.find(c => c.className === 'block');

			expect(trueClass?.conditionalBranchId).toMatch(/^ternary:true:\d+$/);
			expect(falseClass?.conditionalBranchId).toMatch(/^ternary:false:\d+$/);
		});
	});

	describe('extract - binary expressions', () => {
		it('should extract classes from logical AND expression', () => {
			const sourceFile = createSourceFile("<div className={active && 'flex'}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract multiple classes from logical AND expression', () => {
			const sourceFile = createSourceFile(
				"<div className={active && 'flex items-center'}>Hello</div>"
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - utility functions', () => {
		it('should extract classes from clsx call', () => {
			const sourceFile = createSourceFile(
				"<div className={clsx('flex', 'items-center')}>Hello</div>"
			);
			const context = createContext(sourceFile, {
				utilities: { clsx: '*' }
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center']);
		});

		it('should extract classes from cn call', () => {
			const sourceFile = createSourceFile(
				"<div className={cn('flex', 'items-center')}>Hello</div>"
			);
			const context = createContext(sourceFile, {
				utilities: { cn: '*' }
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});

		it('should not extract from unknown function calls', () => {
			const sourceFile = createSourceFile(
				"<div className={unknownFn('flex', 'items-center')}>Hello</div>"
			);
			const context = createContext(sourceFile, {
				utilities: { clsx: '*' }
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(0);
		});

		it('should extract classes from utility function with object argument', () => {
			const sourceFile = createSourceFile(
				'<div className={clsx({ flex: true, hidden: false })}>Hello</div>'
			);
			const context = createContext(sourceFile, {
				utilities: { clsx: '*' }
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('hidden');
		});

		it('should extract classes from utility function with array argument', () => {
			const sourceFile = createSourceFile(
				"<div className={clsx(['flex', 'items-center'])}>Hello</div>"
			);
			const context = createContext(sourceFile, {
				utilities: { clsx: '*' }
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - different attribute names', () => {
		it('should extract from className attribute', () => {
			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract from class attribute (Solid.js style)', () => {
			const sourceFile = createSourceFile('<div class="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract from classList attribute', () => {
			const sourceFile = createSourceFile('<div classList="flex items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});

		it('should extract from custom class attributes', () => {
			const sourceFile = createSourceFile('<View colorStyles="flex items-center">Hello</View>');
			const context = createContext(sourceFile, {
				classAttributes: ['className', 'class', 'classList', 'colorStyles']
			});
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});

		it('should not extract from non-class attributes', () => {
			const sourceFile = createSourceFile('<div id="flex" data-test="items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extract - attributeId', () => {
		it('should assign unique attributeId to classes from same attribute', () => {
			const sourceFile = createSourceFile('<div className="flex items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes[0].attributeId).toBeDefined();
			expect(classes[0].attributeId).toBe(classes[1].attributeId);
		});

		it('should assign different attributeIds for different attributes', () => {
			const sourceFile = createSourceFile('<div className="flex" class="items-center">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes[0].attributeId).not.toBe(classes[1].attributeId);
		});
	});

	describe('extract - array literals', () => {
		it('should extract classes from array literal expression', () => {
			const sourceFile = createSourceFile("<div className={['flex', 'items-center']}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - object literals', () => {
		it('should extract class names from object keys', () => {
			const sourceFile = createSourceFile(
				"<div className={{ flex: true, 'items-center': active }}>Hello</div>"
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes.map(c => c.className)).toContain('flex');
			expect(classes.map(c => c.className)).toContain('items-center');
		});
	});

	describe('extract - type assertions', () => {
		it('should extract classes through as expression', () => {
			const sourceFile = createSourceFile(
				"<div className={'flex items-center' as string}>Hello</div>"
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});

		it('should extract classes through non-null assertion', () => {
			const sourceFile = createSourceFile('<div className={className!}>Hello</div>');
			const context = createContext(sourceFile);

			// This should not crash
			expect(() => {
				const element = findJsxElement(sourceFile)!;
				extractor.extract(element, context);
			}).not.toThrow();
		});
	});

	describe('extract - parenthesized expressions', () => {
		it('should extract classes through parenthesized expression', () => {
			const sourceFile = createSourceFile("<div className={('flex items-center')}>Hello</div>");
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(2);
		});
	});

	describe('edge cases', () => {
		it('should handle elements without attributes', () => {
			const sourceFile = createSourceFile('<div>Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(0);
		});

		it('should handle JSX expression without expression (empty braces)', () => {
			// This is technically invalid JSX but should not crash
			const sourceFile = createSourceFile('<div className={undefined}>Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			expect(() => extractor.extract(element, context)).not.toThrow();
		});

		it('should handle very long class strings', () => {
			const longClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`).join(' ');
			const sourceFile = createSourceFile(`<div className="${longClasses}">Hello</div>`);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(100);
		});

		it('should handle special characters in class names', () => {
			const sourceFile = createSourceFile(
				'<div className="w-1/2 -mt-4 hover:bg-blue-500">Hello</div>'
			);
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toEqual(['w-1/2', '-mt-4', 'hover:bg-blue-500']);
		});

		it('should return correct line numbers', () => {
			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes[0].line).toBe(1);
		});

		it('should return correct file name', () => {
			const sourceFile = createSourceFile('<div className="flex">Hello</div>');
			const context = createContext(sourceFile);
			const element = findJsxElement(sourceFile)!;

			const classes = extractor.extract(element, context);

			expect(classes[0].file).toBe('test.tsx');
		});
	});
});
