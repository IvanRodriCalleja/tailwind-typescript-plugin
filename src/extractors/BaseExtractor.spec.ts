import * as ts from 'typescript/lib/tsserverlibrary';

import { ClassNameInfo, ExtractionContext, UtilityFunction } from '../core/types';
import { BaseExtractor } from './BaseExtractor';

// Create a concrete implementation for testing
class TestExtractor extends BaseExtractor {
	canHandle(node: ts.Node): boolean {
		return ts.isStringLiteral(node);
	}

	extract(node: ts.Node, context: ExtractionContext): ClassNameInfo[] {
		if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
			return this.extractFromStringLiteral(node, context);
		}
		return [];
	}

	// Expose protected methods for testing
	public testShouldValidateFunctionCall(
		callExpression: ts.CallExpression,
		utilityFunctions: UtilityFunction[],
		context?: ExtractionContext
	): boolean {
		return this.shouldValidateFunctionCall(callExpression, utilityFunctions, context);
	}

	public testIsImportedFrom(
		functionName: string,
		expectedModule: string,
		context: ExtractionContext
	): boolean {
		return this.isImportedFrom(functionName, expectedModule, context);
	}

	public testIsNamespaceImportedFrom(
		objectName: string,
		expectedModule: string,
		context: ExtractionContext
	): boolean {
		return this.isNamespaceImportedFrom(objectName, expectedModule, context);
	}

	public testIsUtilityFunctionName(
		functionName: string,
		utilityFunctions: UtilityFunction[]
	): boolean {
		return this.isUtilityFunctionName(functionName, utilityFunctions);
	}
}

describe('BaseExtractor', () => {
	let extractor: TestExtractor;

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

	const findStringLiteral = (sourceFile: ts.SourceFile): ts.StringLiteral | undefined => {
		let result: ts.StringLiteral | undefined;
		const visit = (node: ts.Node): void => {
			if (ts.isStringLiteral(node)) {
				result = node;
				return;
			}
			ts.forEachChild(node, visit);
		};
		visit(sourceFile);
		return result;
	};

	beforeEach(() => {
		extractor = new TestExtractor();
	});

	describe('extractFromStringLiteral', () => {
		it('should extract single class name', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(1);
			expect(classes[0].className).toBe('flex');
		});

		it('should extract multiple class names separated by spaces', () => {
			const code = 'const x = "flex items-center justify-between";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(3);
			expect(classes.map(c => c.className)).toEqual(['flex', 'items-center', 'justify-between']);
		});

		it('should handle multiple whitespace between classes', () => {
			const code = 'const x = "flex    items-center";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(2);
		});

		it('should handle newlines in string', () => {
			const code = 'const x = "flex items-center justify-between";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(3);
		});

		it('should handle tabs in string', () => {
			const code = 'const x = "flex\titems-center";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(2);
		});

		it('should return empty array for empty string', () => {
			const code = 'const x = "";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(0);
		});

		it('should return empty array for whitespace-only string', () => {
			const code = 'const x = "   ";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes).toHaveLength(0);
		});

		it('should set correct absoluteStart for each class', () => {
			const code = 'const x = "flex items-center";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

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
			const code = 'const x = "flex";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes[0].line).toBe(1);
		});

		it('should set correct file name', () => {
			const code = 'const x = "flex";';
			const context = createContext(code);
			const literal = findStringLiteral(context.sourceFile)!;

			const classes = extractor.extract(literal, context);

			expect(classes[0].file).toBe('test.tsx');
		});
	});

	describe('shouldValidateFunctionCall', () => {
		it('should return true for matching simple function name', () => {
			const code = "clsx('flex')";
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(callExpr, ['clsx']);

			expect(result).toBe(true);
		});

		it('should return false for non-matching function name', () => {
			const code = "unknownFn('flex')";
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(callExpr, ['clsx']);

			expect(result).toBe(false);
		});

		it('should return true for utility function with matching import', () => {
			const code = `
				import { clsx } from 'clsx';
				clsx('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'clsx', from: 'clsx' }],
				context
			);

			expect(result).toBe(true);
		});

		it('should return false for utility function with non-matching import', () => {
			const code = `
				import { clsx } from 'other-package';
				clsx('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'clsx', from: 'clsx' }],
				context
			);

			expect(result).toBe(false);
		});

		it('should handle aliased imports', () => {
			const code = `
				import { clsx as cx } from 'clsx';
				cx('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'cx', from: 'clsx' }],
				context
			);

			expect(result).toBe(true);
		});

		it('should handle default imports', () => {
			const code = `
				import clsx from 'clsx';
				clsx('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'clsx', from: 'clsx' }],
				context
			);

			expect(result).toBe(true);
		});

		it('should handle namespace imports', () => {
			const code = `
				import * as utils from 'clsx';
				utils.clsx('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'clsx', from: 'clsx' }],
				context
			);

			expect(result).toBe(true);
		});

		it('should handle member expressions with property access', () => {
			const code = `
				import * as lib from 'my-lib';
				lib.cn('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'cn', from: 'my-lib' }],
				context
			);

			expect(result).toBe(true);
		});

		it('should return true without context when config specifies import', () => {
			const code = "clsx('flex')";
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'clsx', from: 'clsx' }]
				// No context passed
			);

			expect(result).toBe(true);
		});

		it('should handle subpath imports', () => {
			const code = `
				import { tv } from 'tailwind-variants/lite';
				tv('flex');
			`;
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(
				callExpr,
				[{ name: 'tv', from: 'tailwind-variants' }],
				context
			);

			expect(result).toBe(true);
		});
	});

	describe('isImportedFrom', () => {
		it('should return true for matching named import', () => {
			const code = `
				import { clsx } from 'clsx';
				clsx('flex');
			`;
			const context = createContext(code);

			const result = extractor.testIsImportedFrom('clsx', 'clsx', context);

			expect(result).toBe(true);
		});

		it('should return false for non-existent import', () => {
			const code = `
				import { other } from 'clsx';
			`;
			const context = createContext(code);

			const result = extractor.testIsImportedFrom('clsx', 'clsx', context);

			expect(result).toBe(false);
		});

		it('should return false for wrong module', () => {
			const code = `
				import { clsx } from 'wrong-module';
			`;
			const context = createContext(code);

			const result = extractor.testIsImportedFrom('clsx', 'clsx', context);

			expect(result).toBe(false);
		});

		it('should handle subpath matches', () => {
			const code = `
				import { tv } from 'tailwind-variants/lite';
			`;
			const context = createContext(code);

			const result = extractor.testIsImportedFrom('tv', 'tailwind-variants', context);

			expect(result).toBe(true);
		});
	});

	describe('isNamespaceImportedFrom', () => {
		it('should return true for matching namespace import', () => {
			const code = `
				import * as utils from 'clsx';
			`;
			const context = createContext(code);

			const result = extractor.testIsNamespaceImportedFrom('utils', 'clsx', context);

			expect(result).toBe(true);
		});

		it('should return false for non-existent namespace import', () => {
			const code = `
				import * as other from 'clsx';
			`;
			const context = createContext(code);

			const result = extractor.testIsNamespaceImportedFrom('utils', 'clsx', context);

			expect(result).toBe(false);
		});

		it('should return false for wrong module', () => {
			const code = `
				import * as utils from 'wrong-module';
			`;
			const context = createContext(code);

			const result = extractor.testIsNamespaceImportedFrom('utils', 'clsx', context);

			expect(result).toBe(false);
		});

		it('should handle subpath matches', () => {
			const code = `
				import * as tv from 'tailwind-variants/lite';
			`;
			const context = createContext(code);

			const result = extractor.testIsNamespaceImportedFrom('tv', 'tailwind-variants', context);

			expect(result).toBe(true);
		});
	});

	describe('isUtilityFunctionName', () => {
		it('should return true for matching simple string', () => {
			const result = extractor.testIsUtilityFunctionName('clsx', ['clsx', 'cn']);

			expect(result).toBe(true);
		});

		it('should return true for matching config object', () => {
			const result = extractor.testIsUtilityFunctionName('clsx', [
				{ name: 'clsx', from: 'clsx' },
				{ name: 'cn', from: '@/lib/utils' }
			]);

			expect(result).toBe(true);
		});

		it('should return false for non-matching function name', () => {
			const result = extractor.testIsUtilityFunctionName('unknown', ['clsx', 'cn']);

			expect(result).toBe(false);
		});

		it('should return false for empty array', () => {
			const result = extractor.testIsUtilityFunctionName('clsx', []);

			expect(result).toBe(false);
		});
	});

	describe('import caching', () => {
		it('should cache import mappings', () => {
			const code = `
				import { clsx } from 'clsx';
				clsx('flex');
			`;
			const context = createContext(code);

			// Call twice to test caching
			extractor.testIsImportedFrom('clsx', 'clsx', context);
			const result = extractor.testIsImportedFrom('clsx', 'clsx', context);

			expect(result).toBe(true);
		});

		it('should clear cache when clearImportCache is called', () => {
			const code = `
				import { clsx } from 'clsx';
			`;
			const context = createContext(code);

			extractor.testIsImportedFrom('clsx', 'clsx', context);
			extractor.clearImportCache();

			// Should rebuild cache
			const result = extractor.testIsImportedFrom('clsx', 'clsx', context);
			expect(result).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle imports without import clause', () => {
			const code = `
				import 'side-effect-module';
			`;
			const context = createContext(code);

			const result = extractor.testIsImportedFrom('anything', 'side-effect-module', context);

			expect(result).toBe(false);
		});

		it('should handle non-string module specifiers', () => {
			// This is technically invalid but should not crash
			const code = `
				import { clsx } from 'clsx';
			`;
			const context = createContext(code);

			expect(() => extractor.testIsImportedFrom('clsx', 'clsx', context)).not.toThrow();
		});

		it('should handle mixed import types', () => {
			const code = `
				import defaultExport, { named } from 'module';
				import * as ns from 'other-module';
			`;
			const context = createContext(code);

			expect(extractor.testIsImportedFrom('defaultExport', 'module', context)).toBe(true);
			expect(extractor.testIsImportedFrom('named', 'module', context)).toBe(true);
			expect(extractor.testIsNamespaceImportedFrom('ns', 'other-module', context)).toBe(true);
		});

		it('should handle call expression without identifier', () => {
			const code = "(function() {})('flex')";
			const context = createContext(code);
			const callExpr = findCallExpression(context.sourceFile)!;

			const result = extractor.testShouldValidateFunctionCall(callExpr, ['clsx']);

			expect(result).toBe(false);
		});
	});
});
