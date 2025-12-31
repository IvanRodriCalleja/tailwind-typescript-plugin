import * as ts from 'typescript/lib/tsserverlibrary';

import { ExtractionContext } from '../core/types';
import { VariableReferenceExtractor } from './VariableReferenceExtractor';

describe('VariableReferenceExtractor', () => {
	let extractor: VariableReferenceExtractor;

	const createContextWithoutTypeChecker = (code: string): ExtractionContext => {
		const sourceFile = ts.createSourceFile('test.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
		return {
			typescript: ts,
			sourceFile,
			utilityFunctions: [],
		};
	};

	const findIdentifier = (sourceFile: ts.SourceFile, name: string): ts.Identifier | undefined => {
		let result: ts.Identifier | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isIdentifier(node) && node.text === name) {
				result = node;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	beforeEach(() => {
		extractor = new VariableReferenceExtractor();
	});

	describe('canHandle', () => {
		it('should return true for identifiers', () => {
			const code = 'const x = myVar;';
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'myVar');

			expect(identifier).toBeDefined();
			expect(extractor.canHandle(identifier!, context)).toBe(true);
		});

		it('should return false for non-identifiers', () => {
			const code = 'const x = "string";';
			const context = createContextWithoutTypeChecker(code);

			expect(extractor.canHandle(context.sourceFile.statements[0], context)).toBe(false);
		});

		it('should return true for identifier in variable declaration', () => {
			const code = 'const myVar = "flex";';
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'myVar');

			expect(identifier).toBeDefined();
			expect(extractor.canHandle(identifier!, context)).toBe(true);
		});
	});

	describe('extract without typeChecker', () => {
		it('should return empty array without type checker', () => {
			const code = `
				const myClass = 'flex';
				const x = myClass;
			`;
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'myClass');

			const classes = extractor.extract(identifier!, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array for non-identifier', () => {
			const context = createContextWithoutTypeChecker('const x = "string";');

			const classes = extractor.extract(context.sourceFile, context);

			expect(classes).toHaveLength(0);
		});
	});

	describe('extractFromIdentifier without typeChecker', () => {
		it('should return empty array when typeChecker is not available', () => {
			const code = `
				const myClass = 'flex items-center';
				const x = myClass;
			`;
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'myClass');

			const classes = extractor.extractFromIdentifier(identifier!, context);

			// Without typeChecker, should return empty
			expect(classes).toHaveLength(0);
		});
	});

	describe('edge cases', () => {
		it('should not crash on undefined identifier', () => {
			const code = 'const x = 1;';
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'nonexistent');

			// identifier is undefined, but should not crash
			expect(identifier).toBeUndefined();
		});

		it('should handle empty source file', () => {
			const context = createContextWithoutTypeChecker('');

			expect(() => extractor.canHandle(context.sourceFile, context)).not.toThrow();
		});

		it('should handle complex expressions', () => {
			const code = `
				const condition = true;
				const classes = condition ? 'flex' : 'block';
				const result = classes;
			`;
			const context = createContextWithoutTypeChecker(code);
			const identifier = findIdentifier(context.sourceFile, 'classes');

			// Should not crash even without typeChecker
			expect(() => extractor.extractFromIdentifier(identifier!, context)).not.toThrow();
		});
	});
});
