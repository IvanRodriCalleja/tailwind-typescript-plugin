import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { NoOpLogger } from '../utils/Logger';
import { CompletionService, CompletionServiceConfig } from './CompletionService';

const defaultConfig: CompletionServiceConfig = {
	utilityFunctions: ['clsx', 'cn', 'classnames', 'classNames', 'cx', 'twMerge'],
	tailwindVariantsEnabled: true,
	classVarianceAuthorityEnabled: true
};

describe('CompletionService', () => {
	let validator: TailwindValidator;
	let completionService: CompletionService;

	beforeEach(() => {
		validator = new TailwindValidator('/fake/path.css', new NoOpLogger());
		// Mock the validator methods
		jest
			.spyOn(validator, 'getAllClasses')
			.mockReturnValue([
				'flex',
				'flex-row',
				'flex-col',
				'items-center',
				'items-start',
				'items-end',
				'justify-center',
				'justify-between',
				'p-4',
				'px-4',
				'py-4',
				'bg-red-500',
				'bg-blue-500',
				'text-white',
				'text-black'
			]);
		jest.spyOn(validator, 'isValidClass').mockImplementation((className: string) => {
			return validator.getAllClasses().includes(className);
		});
		jest.spyOn(validator, 'getCssForClasses').mockImplementation((classNames: string[]) => {
			return classNames.map(name => {
				if (name === 'flex') return '.flex { display: flex; }';
				if (name === 'p-4') return '.p-4 { padding: 1rem; }';
				return null;
			});
		});
		completionService = new CompletionService(validator, new NoOpLogger(), defaultConfig);
	});

	describe('getCompletionsAtPosition', () => {
		it('should return original completions when not in className context', () => {
			const sourceCode = 'const x = 1;';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				5, // Position in "const"
				undefined
			);

			expect(result).toBeUndefined();
		});

		it('should provide completions inside className attribute', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside the empty className string (after the opening quote)
			const position = 16;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			expect(result!.entries.length).toBeGreaterThan(0);

			// Should include flex classes
			const flexEntry = result!.entries.find(e => e.name === 'flex');
			expect(flexEntry).toBeDefined();
		});

		it('should filter completions based on prefix', () => {
			const sourceCode = '<div className="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl"
			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();

			// Should only include classes starting with "fl"
			const allStartWithFl = result!.entries.every(e => e.name.toLowerCase().startsWith('fl'));
			expect(allStartWithFl).toBe(true);

			// Should include flex, flex-row, flex-col
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
			expect(names).toContain('flex-row');
			expect(names).toContain('flex-col');
		});

		it('should provide completions after space in className', () => {
			const sourceCode = '<div className="flex ">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "flex " (after the space)
			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			// Should provide all classes except "flex" which is already present
			const names = result!.entries.map(e => e.name);
			expect(names).not.toContain('flex');
			expect(names).toContain('items-center');
		});

		it('should exclude already existing classes from completions', () => {
			// className="flex items-center p"
			// Position:   16   21            35
			const sourceCode = '<div className="flex items-center p">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "p" (typing a new class) - position 35 is after the "p"
			const position = 35;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);

			// Should not include already present classes
			expect(names).not.toContain('flex');
			expect(names).not.toContain('items-center');

			// Should include p-4, px-4, py-4 as they match the "p" prefix
			expect(names).toContain('p-4');
			expect(names).toContain('px-4');
			expect(names).toContain('py-4');
		});

		it('should provide completions in utility function arguments', () => {
			const sourceCode = 'const classes = cn("flex ", isActive && "");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside the second empty string in cn()
			const position = 41;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			expect(result!.entries.length).toBeGreaterThan(0);
		});

		it('should provide completions in clsx function', () => {
			const sourceCode = 'const classes = clsx("f");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "f"
			const position = 23;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			// Should include classes starting with "f"
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in object property className', () => {
			const sourceCode = 'const obj = { className: "fl" };';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl"
			const position = 28;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should set correct replacement span for partial class names', () => {
			const sourceCode = '<div className="flex ite">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "ite"
			const position = 24;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();

			// Each entry should have a replacement span
			const itemsCenter = result!.entries.find(e => e.name === 'items-center');
			expect(itemsCenter).toBeDefined();
			expect(itemsCenter!.replacementSpan).toBeDefined();
			expect(itemsCenter!.replacementSpan!.length).toBe(3); // "ite" length
		});
	});

	describe('getCompletionEntryDetails', () => {
		it('should return CSS documentation for valid Tailwind class', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'flex');

			expect(result).toBeDefined();
			expect(result!.name).toBe('flex');
			expect(result!.documentation).toBeDefined();
			expect(result!.documentation!.length).toBeGreaterThan(0);
			expect(result!.documentation![0].text).toContain('display: flex');
		});

		it('should format documentation with markdown CSS code block', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'flex');

			expect(result).toBeDefined();
			expect(result!.documentation).toBeDefined();

			// Documentation should be wrapped in markdown CSS code block for syntax highlighting
			const docText = result!.documentation![0].text;
			expect(docText).toContain('```css');
			expect(docText).toContain('```');
		});

		it('should provide short CSS summary in displayParts', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'flex');

			expect(result).toBeDefined();
			expect(result!.displayParts).toBeDefined();
			expect(result!.displayParts!.length).toBeGreaterThan(0);

			// displayParts should contain just the declaration (e.g., "display: flex;")
			const displayText = result!.displayParts![0].text;
			expect(displayText).toContain('display: flex');
			expect(displayText).not.toContain('.flex');
			expect(displayText).not.toContain('{');
		});

		it('should return undefined for non-Tailwind class', () => {
			const sourceCode = '<div className="my-custom-class">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(
				ts,
				sourceFile,
				16,
				'my-custom-class'
			);

			expect(result).toBeUndefined();
		});

		it('should format CSS with proper indentation', () => {
			// Mock a class with multiple declarations
			jest.spyOn(validator, 'getCssForClasses').mockImplementation((classNames: string[]) => {
				return classNames.map(name => {
					if (name === 'p-4')
						return '.p-4 { padding-top: 1rem; padding-right: 1rem; padding-bottom: 1rem; padding-left: 1rem; }';
					return null;
				});
			});

			const sourceCode = '<div className="p-4">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'p-4');

			expect(result).toBeDefined();
			const docText = result!.documentation![0].text;

			// Should be formatted with newlines for multiple declarations
			expect(docText).toContain('\n');
			expect(docText).toContain('padding-top: 1rem;');
			expect(docText).toContain('padding-right: 1rem;');
		});
	});

	describe('color class detection', () => {
		it('should mark color classes with "color" kindModifier', () => {
			// Add color classes to the mock
			jest.spyOn(validator, 'getAllClasses').mockReturnValue([
				'flex',
				'bg-red-500',
				'bg-blue-200',
				'text-white',
				'text-black',
				'border-gray-300',
				'ring-indigo-500',
				'text-sm', // not a color
				'border-2' // not a color
			]);

			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();

			// Color classes should have 'color' kindModifier
			const bgRed = result!.entries.find(e => e.name === 'bg-red-500');
			expect(bgRed?.kindModifiers).toBe('color');

			const textWhite = result!.entries.find(e => e.name === 'text-white');
			expect(textWhite?.kindModifiers).toBe('color');

			const borderGray = result!.entries.find(e => e.name === 'border-gray-300');
			expect(borderGray?.kindModifiers).toBe('color');

			// Non-color classes should have empty kindModifier
			const flexEntry = result!.entries.find(e => e.name === 'flex');
			expect(flexEntry?.kindModifiers).toBe('');

			const textSm = result!.entries.find(e => e.name === 'text-sm');
			expect(textSm?.kindModifiers).toBe('');

			const border2 = result!.entries.find(e => e.name === 'border-2');
			expect(border2?.kindModifiers).toBe('');
		});

		it('should detect various color class patterns', () => {
			jest.spyOn(validator, 'getAllClasses').mockReturnValue([
				'from-purple-400', // gradient from
				'via-pink-500', // gradient via
				'to-red-500', // gradient to
				'fill-current', // SVG fill
				'stroke-blue-600', // SVG stroke
				'accent-violet-500', // accent color
				'shadow-sm', // not a color (shadow size)
				'outline-none', // not a color (outline style)
				'divide-y', // not a color (divide direction)
				'text-center' // not a color (text alignment)
			]);

			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();

			// Color classes
			expect(result!.entries.find(e => e.name === 'from-purple-400')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'via-pink-500')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'to-red-500')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'fill-current')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'stroke-blue-600')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'accent-violet-500')?.kindModifiers).toBe(
				'color'
			);

			// Non-color classes
			expect(result!.entries.find(e => e.name === 'shadow-sm')?.kindModifiers).toBe('');
			expect(result!.entries.find(e => e.name === 'outline-none')?.kindModifiers).toBe('');
			expect(result!.entries.find(e => e.name === 'divide-y')?.kindModifiers).toBe('');
			expect(result!.entries.find(e => e.name === 'text-center')?.kindModifiers).toBe('');
		});
	});

	describe('clearCache', () => {
		it('should clear the cached class list', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// First call to populate cache
			completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			// Clear cache
			completionService.clearCache();

			// Mock different classes
			jest.spyOn(validator, 'getAllClasses').mockReturnValue(['new-class', 'another-class']);

			// Get completions again
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('new-class');
			expect(names).toContain('another-class');
			expect(names).not.toContain('flex');
		});
	});

	describe('custom utility functions', () => {
		it('should provide completions in custom utility function', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: ['myCustomClass', { name: 'styles', from: '@/utils' }],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const x = myCustomClass("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl"
			const position = 27;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in tv() when tailwindVariants is enabled', () => {
			const sourceCode = 'const button = tv({ base: "fl" });';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position at "l" inside "fl" string (position 28)
			// const button = tv({ base: "fl" });
			//                            ^^ position 27-28
			const position = 28;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should NOT provide completions in tv() when tailwindVariants is disabled', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: ['clsx'],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const button = tv({ base: "fl" });';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl" inside the string
			const position = 29;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			// Should not provide Tailwind completions since tv() is not recognized
			expect(result).toBeUndefined();
		});

		it('should provide completions in cva() when classVarianceAuthority is enabled', () => {
			const sourceCode = 'const button = cva("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl"
			const position = 22;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should NOT provide completions in cva() when classVarianceAuthority is disabled', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: ['clsx'],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const button = cva("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl"
			const position = 22;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			// Should not provide Tailwind completions since cva() is not recognized
			expect(result).toBeUndefined();
		});

		it('should provide completions with UtilityFunctionConfig objects', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: [{ name: 'customStyles', from: '@/lib/styles' }],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const x = customStyles("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 26;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions with mixed string and object utility functions', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: ['simpleUtil', { name: 'configuredUtil', from: '@/utils' }],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			// Test simple string utility
			const sourceCode1 = 'const x = simpleUtil("fl");';
			const sourceFile1 = ts.createSourceFile(
				'test.tsx',
				sourceCode1,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result1 = customService.getCompletionsAtPosition(ts, sourceFile1, 24, undefined);
			expect(result1).toBeDefined();
			expect(result1!.entries.map(e => e.name)).toContain('flex');

			// Test configured utility
			const sourceCode2 = 'const x = configuredUtil("fl");';
			const sourceFile2 = ts.createSourceFile(
				'test.tsx',
				sourceCode2,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result2 = customService.getCompletionsAtPosition(ts, sourceFile2, 28, undefined);
			expect(result2).toBeDefined();
			expect(result2!.entries.map(e => e.name)).toContain('flex');
		});

		it('should provide completions in tv() variants property', () => {
			const sourceCode = `const button = tv({
				base: "flex",
				variants: {
					color: {
						primary: "bg-blue-500 te",
						secondary: "bg-gray-500"
					}
				}
			});`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Find position after "te" in primary variant
			const position = sourceCode.indexOf('te",') + 2;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('text-white');
			expect(names).toContain('text-black');
		});

		it('should provide completions in cva() variants property', () => {
			const sourceCode = `const button = cva("base-class", {
				variants: {
					size: {
						sm: "p-",
						lg: "p-4"
					}
				}
			});`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Find position after "p-" in sm variant
			const position = sourceCode.indexOf('p-",') + 2;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			// Should match classes starting with "p-" from the mock (p-4, px-4, py-4)
			expect(names).toContain('p-4');
		});

		it('should provide completions in tv() compoundVariants', () => {
			const sourceCode = `const button = tv({
				base: "flex",
				variants: {
					color: { primary: "bg-blue-500" }
				},
				compoundVariants: [
					{ color: "primary", class: "fl" }
				]
			});`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Find position after "fl" in compoundVariants class
			const position = sourceCode.indexOf('"fl"') + 3;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should enable both tv and cva when both variant options are true', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: [],
				tailwindVariantsEnabled: true,
				classVarianceAuthorityEnabled: true
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			// Test tv()
			const tvSource = 'const x = tv({ base: "fl" });';
			const tvFile = ts.createSourceFile(
				'test.tsx',
				tvSource,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);
			const tvResult = customService.getCompletionsAtPosition(ts, tvFile, 24, undefined);
			expect(tvResult).toBeDefined();

			// Test cva()
			const cvaSource = 'const x = cva("fl");';
			const cvaFile = ts.createSourceFile(
				'test.tsx',
				cvaSource,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);
			const cvaResult = customService.getCompletionsAtPosition(ts, cvaFile, 17, undefined);
			expect(cvaResult).toBeDefined();
		});
	});

	describe('JSX attribute variations', () => {
		it('should provide completions in "class" attribute', () => {
			const sourceCode = '<div class="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 14;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in "classList" attribute', () => {
			const sourceCode = '<div classList="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should NOT provide completions in non-className attributes', () => {
			const sourceCode = '<div id="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 11;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeUndefined();
		});

		it('should NOT provide completions in data attributes', () => {
			const sourceCode = '<div data-class="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 19;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeUndefined();
		});

		it('should provide completions in self-closing JSX element', () => {
			const sourceCode = '<input className="fl" />';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in nested JSX elements', () => {
			const sourceCode = '<div><span className="fl"></span></div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 24;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});
	});

	describe('utility function contexts', () => {
		it('should provide completions in nested utility function calls', () => {
			const sourceCode = 'const x = cn(clsx("fl"));';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in twMerge function', () => {
			const sourceCode = 'const x = twMerge("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in classnames function (lowercase)', () => {
			const sourceCode = 'const x = classnames("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 24;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in classNames function (camelCase)', () => {
			const sourceCode = 'const x = classNames("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 24;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in cx function', () => {
			const sourceCode = 'const x = cx("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 16;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in conditional utility function argument', () => {
			const sourceCode = 'const x = cn(isActive ? "fl" : "hidden");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside the first string "fl"
			const position = 27;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in array argument of utility function', () => {
			const sourceCode = 'const x = cn(["fl", "items-center"]);';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside "fl"
			const position = 17;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in object value of utility function', () => {
			const sourceCode = 'const x = cn({ "fl": isActive });';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside "fl" key
			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should NOT provide completions in unknown function', () => {
			const sourceCode = 'const x = unknownFn("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 23;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeUndefined();
		});

		it('should provide completions with property access expression (method call)', () => {
			// When cn is called as a method: utils.cn("fl")
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: ['cn'],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const x = utils.cn("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 22;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});
	});

	describe('edge cases and position handling', () => {
		it('should handle empty className attribute', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside empty string
			const position = 16;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			expect(result!.entries.length).toBeGreaterThan(0);
		});

		it('should handle position at start of string content', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position at start of string content (right after opening quote)
			const position = 16;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
		});

		it('should handle multiple spaces between classes', () => {
			const sourceCode = '<div className="flex   items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after multiple spaces
			const position = 23;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
		});

		it('should handle trailing space in className', () => {
			const sourceCode = '<div className="flex ">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after trailing space
			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			// flex should be excluded as it's already in the string
			const names = result!.entries.map(e => e.name);
			expect(names).not.toContain('flex');
		});

		it('should return existingCompletions when no Tailwind classes match', () => {
			// Mock empty class list
			jest.spyOn(validator, 'getAllClasses').mockReturnValue([]);

			const existingCompletions: ts.CompletionInfo = {
				isGlobalCompletion: false,
				isMemberCompletion: false,
				isNewIdentifierLocation: false,
				entries: [{ name: 'existing', kind: ts.ScriptElementKind.unknown, sortText: '0' }]
			};

			const sourceCode = '<div className="xyz">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				19,
				existingCompletions
			);

			expect(result).toBe(existingCompletions);
		});

		it('should handle cursor position before string start', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position before the opening quote
			const position = 14;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			// Should not provide completions when cursor is outside string
			expect(result).toBeUndefined();
		});

		it('should handle very long class names', () => {
			jest
				.spyOn(validator, 'getAllClasses')
				.mockReturnValue(['very-long-tailwind-class-name-that-is-quite-long', 'flex']);

			const sourceCode = '<div className="very">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('very-long-tailwind-class-name-that-is-quite-long');
		});

		it('should handle special characters in class prefix', () => {
			jest
				.spyOn(validator, 'getAllClasses')
				.mockReturnValue(['w-1/2', 'w-1/3', 'w-1/4', '-mt-4', '-translate-x-1/2']);

			const sourceCode = '<div className="w-1/">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('w-1/2');
			expect(names).toContain('w-1/3');
			expect(names).toContain('w-1/4');
		});

		it('should handle negative value classes', () => {
			jest.spyOn(validator, 'getAllClasses').mockReturnValue(['-mt-4', '-mb-4', '-ml-4', '-mr-4']);

			const sourceCode = '<div className="-m">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('-mt-4');
			expect(names).toContain('-mb-4');
		});

		it('should handle arbitrary value classes', () => {
			jest
				.spyOn(validator, 'getAllClasses')
				.mockReturnValue(['w-[100px]', 'h-[50vh]', 'bg-[#ff0000]']);

			const sourceCode = '<div className="w-[">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 19;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('w-[100px]');
		});
	});

	describe('sort text ordering', () => {
		it('should prioritize exact matches', () => {
			jest.spyOn(validator, 'getAllClasses').mockReturnValue(['flex', 'flex-row', 'flex-col']);

			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const flexEntry = result!.entries.find(e => e.name === 'flex');
			const flexRowEntry = result!.entries.find(e => e.name === 'flex-row');

			// Exact match should have lower sortText (higher priority)
			expect(flexEntry!.sortText < flexRowEntry!.sortText).toBe(true);
		});

		it('should prioritize prefix matches over non-matches', () => {
			jest
				.spyOn(validator, 'getAllClasses')
				.mockReturnValue(['flex', 'flex-row', 'items-center', 'justify-center']);

			const sourceCode = '<div className="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const flexEntry = result!.entries.find(e => e.name === 'flex');

			// Prefix match should start with "1"
			expect(flexEntry!.sortText.startsWith('1')).toBe(true);
		});

		it('should sort alphabetically within same priority', () => {
			jest.spyOn(validator, 'getAllClasses').mockReturnValue(['flex-col', 'flex-row', 'flex']);

			const sourceCode = '<div className="flex-">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);

			// Both should be prefix matches with alphabetical ordering
			const colIndex = names.indexOf('flex-col');
			const rowIndex = names.indexOf('flex-row');
			expect(colIndex).toBeLessThan(rowIndex);
		});
	});

	describe('color class detection - additional patterns', () => {
		beforeEach(() => {
			jest
				.spyOn(validator, 'getAllClasses')
				.mockReturnValue([
					'bg-red-500',
					'bg-red-500/50',
					'bg-[#ff0000]',
					'bg-gradient-to-r',
					'text-transparent',
					'text-current',
					'text-inherit',
					'placeholder-gray-400',
					'caret-blue-500',
					'decoration-pink-500',
					'divide-slate-200',
					'ring-offset-white',
					'shadow-black/25',
					'bg-opacity-50',
					'text-opacity-75'
				]);
		});

		it('should detect color classes with opacity modifiers', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			expect(result!.entries.find(e => e.name === 'bg-red-500/50')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'shadow-black/25')?.kindModifiers).toBe('color');
		});

		it('should detect arbitrary color values', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			expect(result!.entries.find(e => e.name === 'bg-[#ff0000]')?.kindModifiers).toBe('color');
		});

		it('should detect special color values (transparent, current, inherit)', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			expect(result!.entries.find(e => e.name === 'text-transparent')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'text-current')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'text-inherit')?.kindModifiers).toBe('color');
		});

		it('should detect placeholder, caret, and decoration colors', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			expect(result!.entries.find(e => e.name === 'placeholder-gray-400')?.kindModifiers).toBe(
				'color'
			);
			expect(result!.entries.find(e => e.name === 'caret-blue-500')?.kindModifiers).toBe('color');
			expect(result!.entries.find(e => e.name === 'decoration-pink-500')?.kindModifiers).toBe(
				'color'
			);
		});

		it('should NOT mark gradient direction as color', () => {
			const sourceCode = '<div className="">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionsAtPosition(ts, sourceFile, 16, undefined);

			expect(result).toBeDefined();
			// bg-gradient-to-r is not a color, it's a gradient direction
			expect(result!.entries.find(e => e.name === 'bg-gradient-to-r')?.kindModifiers).toBe('');
		});
	});

	describe('getCompletionEntryDetails - additional cases', () => {
		it('should set color kindModifier in completion details', () => {
			jest
				.spyOn(validator, 'getCssForClasses')
				.mockReturnValue(['.bg-red-500 { background-color: rgb(239 68 68); }']);

			const sourceCode = '<div className="bg-red-500">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'bg-red-500');

			expect(result).toBeDefined();
			expect(result!.kindModifiers).toBe('color');
		});

		it('should NOT set color kindModifier for non-color class in details', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'flex');

			expect(result).toBeDefined();
			expect(result!.kindModifiers).toBe('');
		});

		it('should handle class with no CSS definition gracefully', () => {
			jest.spyOn(validator, 'getCssForClasses').mockReturnValue([null]);
			jest.spyOn(validator, 'isValidClass').mockReturnValue(true);

			const sourceCode = '<div className="unknown-class">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(
				ts,
				sourceFile,
				16,
				'unknown-class'
			);

			expect(result).toBeDefined();
			expect(result!.name).toBe('unknown-class');
			expect(result!.documentation).toEqual([]);
			expect(result!.displayParts![0].text).toBe('unknown-class');
		});

		it('should format CSS with already formatted multiline input', () => {
			const multilineCss = `.complex {\n  display: flex;\n  align-items: center;\n}`;
			jest.spyOn(validator, 'getCssForClasses').mockReturnValue([multilineCss]);
			jest.spyOn(validator, 'isValidClass').mockReturnValue(true);

			const sourceCode = '<div className="complex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const result = completionService.getCompletionEntryDetails(ts, sourceFile, 16, 'complex');

			expect(result).toBeDefined();
			// Should preserve the already formatted CSS
			expect(result!.documentation![0].text).toContain(multilineCss);
		});
	});

	describe('template literals', () => {
		it('should provide completions in template literal utility function', () => {
			const sourceCode = 'const x = cn(`fl`);';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside template literal
			const position = 16;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});

		it('should provide completions in NoSubstitutionTemplateLiteral inside utility function', () => {
			const sourceCode = 'const cls = clsx(`flex fl`);';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after "fl" inside template literal
			const position = 25;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex-row');
			expect(names).toContain('flex-col');
		});
	});

	describe('boundary conditions', () => {
		it('should NOT provide completions inside arrow function body', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: [],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'const fn = () => { const x = "fl"; };';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside string in arrow function (not a utility function context)
			const position = 32;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			expect(result).toBeUndefined();
		});

		it('should NOT provide completions inside regular function body', () => {
			const customConfig: CompletionServiceConfig = {
				utilityFunctions: [],
				tailwindVariantsEnabled: false,
				classVarianceAuthorityEnabled: false
			};
			const customService = new CompletionService(validator, new NoOpLogger(), customConfig);

			const sourceCode = 'function fn() { const x = "fl"; }';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside string in function (not a utility function context)
			const position = 29;
			const result = customService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

			expect(result).toBeUndefined();
		});

		it('should provide completions when utility function is inside arrow function', () => {
			const sourceCode = 'const fn = () => cn("fl");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position inside cn() string argument
			const position = 23;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			expect(names).toContain('flex');
		});
	});

	describe('case sensitivity', () => {
		it('should handle case-insensitive prefix matching', () => {
			const sourceCode = '<div className="FL">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const names = result!.entries.map(e => e.name);
			// Should still match lowercase flex classes even with uppercase prefix
			expect(names).toContain('flex');
			expect(names).toContain('flex-row');
		});
	});

	describe('replacement span', () => {
		it('should set correct replacement span at start of string', () => {
			const sourceCode = '<div className="fl">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const flexEntry = result!.entries.find(e => e.name === 'flex');
			expect(flexEntry!.replacementSpan).toEqual({
				start: 16, // Start of "fl"
				length: 2 // Length of "fl"
			});
		});

		it('should set correct replacement span after space', () => {
			const sourceCode = '<div className="flex ite">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 24;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const itemsEntry = result!.entries.find(e => e.name === 'items-center');
			expect(itemsEntry!.replacementSpan).toEqual({
				start: 21, // Start of "ite" (after "flex ")
				length: 3 // Length of "ite"
			});
		});

		it('should set zero-length replacement span when no prefix', () => {
			const sourceCode = '<div className="flex ">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position after space (no prefix yet)
			const position = 21;
			const result = completionService.getCompletionsAtPosition(
				ts,
				sourceFile,
				position,
				undefined
			);

			expect(result).toBeDefined();
			const itemsEntry = result!.entries.find(e => e.name === 'items-center');
			expect(itemsEntry!.replacementSpan).toEqual({
				start: 21,
				length: 0 // No prefix to replace
			});
		});
	});

	describe('getQuickInfoAtPosition (hover)', () => {
		it('should return hover info for valid Tailwind class', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on "flex"
			const position = 18;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts).toBeDefined();
			expect(result!.displayParts!.length).toBeGreaterThan(0);
			expect(result!.displayParts![0].text).toContain('display: flex');
		});

		it('should return correct textSpan for hovered class', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.textSpan).toEqual({
				start: 16, // Start of "flex"
				length: 4 // Length of "flex"
			});
		});

		it('should return documentation with CSS code block', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 18;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.documentation).toBeDefined();
			expect(result!.documentation!.length).toBeGreaterThan(0);

			const docText = result!.documentation![0].text;
			expect(docText).toContain('```css');
			expect(docText).toContain('.flex');
			expect(docText).toContain('display: flex');
		});

		it('should return undefined for non-Tailwind class', () => {
			const sourceCode = '<div className="my-custom-class">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeUndefined();
		});

		it('should return undefined when not in className context', () => {
			const sourceCode = 'const x = "flex";';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 13;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeUndefined();
		});

		it('should set color kindModifier for color classes', () => {
			jest
				.spyOn(validator, 'getCssForClasses')
				.mockReturnValue(['.bg-red-500 { background-color: rgb(239 68 68); }']);

			const sourceCode = '<div className="bg-red-500">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			const position = 20;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.kindModifiers).toBe('color');
		});

		it('should return hover info for class in utility function', () => {
			const sourceCode = 'const x = cn("flex items-center");';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on "flex"
			const position = 16;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts![0].text).toContain('display: flex');
		});

		it('should return hover info for second class in list', () => {
			jest.spyOn(validator, 'getCssForClasses').mockImplementation((classNames: string[]) => {
				return classNames.map(name => {
					if (name === 'flex') return '.flex { display: flex; }';
					if (name === 'items-center') return '.items-center { align-items: center; }';
					return null;
				});
			});

			const sourceCode = '<div className="flex items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on "items-center"
			const position = 25;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts![0].text).toContain('align-items: center');
			expect(result!.textSpan).toEqual({
				start: 21, // Start of "items-center"
				length: 12 // Length of "items-center"
			});
		});

		it('should return undefined for position on whitespace', () => {
			const sourceCode = '<div className="flex  items-center">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on the space between classes
			const position = 21;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			// Should return undefined because we're on whitespace, not a class
			expect(result).toBeUndefined();
		});

		it('should return hover info for class at start of string', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position at the very start of "flex"
			const position = 16;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts![0].text).toContain('display: flex');
		});

		it('should return hover info for class at end of word', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position at the end of "flex" (just before closing quote)
			const position = 20;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts![0].text).toContain('display: flex');
		});

		it('should return undefined when position is outside string', () => {
			const sourceCode = '<div className="flex">Hello</div>';
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on "className" attribute name
			const position = 10;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeUndefined();
		});

		it('should return hover info in tv() variants', () => {
			const sourceCode = `const button = tv({
				base: "flex",
				variants: {
					color: {
						primary: "bg-blue-500"
					}
				}
			});`;
			const sourceFile = ts.createSourceFile(
				'test.tsx',
				sourceCode,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TSX
			);

			// Position on "flex" in base
			const position = sourceCode.indexOf('"flex"') + 2;
			const result = completionService.getQuickInfoAtPosition(ts, sourceFile, position);

			expect(result).toBeDefined();
			expect(result!.displayParts![0].text).toContain('display: flex');
		});
	});
});
