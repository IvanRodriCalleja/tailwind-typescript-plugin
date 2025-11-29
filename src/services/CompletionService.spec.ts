import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindValidator } from '../infrastructure/TailwindValidator';
import { NoOpLogger } from '../utils/Logger';
import { CompletionService } from './CompletionService';

describe('CompletionService', () => {
	let validator: TailwindValidator;
	let completionService: CompletionService;

	beforeEach(() => {
		validator = new TailwindValidator('/fake/path.css', new NoOpLogger());
		// Mock the validator methods
		jest.spyOn(validator, 'getAllClasses').mockReturnValue([
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
		completionService = new CompletionService(validator, new NoOpLogger());
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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
			const result = completionService.getCompletionsAtPosition(ts, sourceFile, position, undefined);

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
					if (name === 'p-4') return '.p-4 { padding-top: 1rem; padding-right: 1rem; padding-bottom: 1rem; padding-left: 1rem; }';
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
				'text-sm',  // not a color
				'border-2'  // not a color
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
				'from-purple-400',  // gradient from
				'via-pink-500',     // gradient via
				'to-red-500',       // gradient to
				'fill-current',     // SVG fill
				'stroke-blue-600',  // SVG stroke
				'accent-violet-500', // accent color
				'shadow-sm',        // not a color (shadow size)
				'outline-none',     // not a color (outline style)
				'divide-y',         // not a color (divide direction)
				'text-center'       // not a color (text alignment)
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
			expect(result!.entries.find(e => e.name === 'accent-violet-500')?.kindModifiers).toBe('color');

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
});
