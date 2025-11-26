import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { getDiagnosticsForFunction, getTextAtDiagnostic, runPluginOnFile } from '../test/test-helpers';

// Diagnostic codes from DiagnosticService
const TAILWIND_DIAGNOSTIC_CODE = 90001;
const TAILWIND_DUPLICATE_CODE = 90002;

describe('E2E Tests - Duplicate Class Detection', () => {
	const testFile = path.join(__dirname, 'duplicate-classes.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile, { utilityFunctions: ['clsx', 'cn'] });
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
	});

	// Helper to get duplicate warnings for a function
	function getDuplicateWarnings(functionName: string): ts.Diagnostic[] {
		return getDiagnosticsForFunction(diagnostics, sourceCode, functionName).filter(
			d => d.code === TAILWIND_DUPLICATE_CODE
		);
	}

	// Helper to get invalid class errors for a function
	function getInvalidClassErrors(functionName: string): ts.Diagnostic[] {
		return getDiagnosticsForFunction(diagnostics, sourceCode, functionName).filter(
			d => d.code === TAILWIND_DIAGNOSTIC_CODE
		);
	}

	describe('Simple Duplicates', () => {
		it('should detect simple duplicate class', () => {
			const warnings = getDuplicateWarnings('SimpleDuplicate');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(warnings[0].category).toBe(ts.DiagnosticCategory.Warning);
		});

		it('should detect triple duplicate (flag 2nd and 3rd)', () => {
			const warnings = getDuplicateWarnings('TripleDuplicate');
			expect(warnings.length).toBe(2);
			warnings.forEach(w => {
				expect(getTextAtDiagnostic(w, sourceCode)).toBe('flex');
				expect(w.category).toBe(ts.DiagnosticCategory.Warning);
			});
		});

		it('should detect multiple different duplicates', () => {
			const warnings = getDuplicateWarnings('MultipleDuplicates');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('items-center');
		});

		it('should detect duplicate at the end', () => {
			const warnings = getDuplicateWarnings('DuplicateAtEnd');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('p-4');
		});

		it('should detect duplicate in the middle', () => {
			const warnings = getDuplicateWarnings('DuplicateInMiddle');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('bg-white');
		});
	});

	describe('No Duplicates (Valid cases)', () => {
		it('should not flag unique classes', () => {
			const warnings = getDuplicateWarnings('NoDuplicates');
			expect(warnings.length).toBe(0);
		});

		it('should not flag similar but different classes', () => {
			const warnings = getDuplicateWarnings('SimilarButDifferent');
			expect(warnings.length).toBe(0);
		});

		it('should not flag same class in different elements', () => {
			const warnings = getDuplicateWarnings('SameClassDifferentElements');
			expect(warnings.length).toBe(0);
		});
	});

	describe('JSX Expressions', () => {
		it('should detect duplicate in JSX expression string', () => {
			const warnings = getDuplicateWarnings('DuplicateInExpression');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect duplicate in template literal', () => {
			const warnings = getDuplicateWarnings('DuplicateInTemplateLiteral');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});
	});

	describe('Utility Function Calls', () => {
		it('should detect duplicate in clsx function', () => {
			const warnings = getDuplicateWarnings('DuplicateInClsx');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect duplicate in cn function', () => {
			const warnings = getDuplicateWarnings('DuplicateInCn');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('p-4');
		});

		it('should detect duplicate across clsx arguments', () => {
			const warnings = getDuplicateWarnings('DuplicateAcrossArguments');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('bg-blue-500');
		});
	});

	describe('Edge Cases', () => {
		it('should detect duplicate with extra spacing', () => {
			const warnings = getDuplicateWarnings('DuplicateWithSpacing');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should not flag empty className', () => {
			const warnings = getDuplicateWarnings('EmptyClassName');
			expect(warnings.length).toBe(0);
		});

		it('should not flag single class', () => {
			const warnings = getDuplicateWarnings('SingleClass');
			expect(warnings.length).toBe(0);
		});
	});

	describe('Arrays', () => {
		it('should detect duplicate in array literal', () => {
			const warnings = getDuplicateWarnings('DuplicateInArray');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect duplicate across array elements', () => {
			const warnings = getDuplicateWarnings('DuplicateAcrossArrayElements');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('bg-blue-500');
		});

		it('should detect duplicate in nested array', () => {
			const warnings = getDuplicateWarnings('DuplicateInNestedArray');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('p-4');
		});
	});

	describe('Ternary Expressions', () => {
		it('should detect duplicate in ternary both branches', () => {
			const warnings = getDuplicateWarnings('DuplicateInTernaryBothBranches');
			// "flex" appears in base, then in both ternary branches - at least 1 duplicate
			expect(warnings.length).toBeGreaterThanOrEqual(1);
			expect(warnings.some(w => getTextAtDiagnostic(w, sourceCode) === 'flex')).toBe(true);
		});

		it('should detect duplicate base and ternary', () => {
			const warnings = getDuplicateWarnings('DuplicateBaseAndTernary');
			expect(warnings.length).toBeGreaterThanOrEqual(1);
			expect(warnings.some(w => getTextAtDiagnostic(w, sourceCode) === 'items-center')).toBe(true);
		});

		it('should detect duplicate in template ternary', () => {
			const warnings = getDuplicateWarnings('DuplicateInTemplateTernary');
			expect(warnings.length).toBeGreaterThanOrEqual(1);
			expect(warnings.some(w => getTextAtDiagnostic(w, sourceCode) === 'p-4')).toBe(true);
		});
	});

	describe('Binary Expressions', () => {
		it('should detect duplicate with binary expression', () => {
			const warnings = getDuplicateWarnings('DuplicateWithBinary');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('text-red-500');
		});

		it('should detect duplicate in template binary', () => {
			const warnings = getDuplicateWarnings('DuplicateInTemplateBinary');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('border');
		});

		it('should detect multiple binary duplicates', () => {
			const warnings = getDuplicateWarnings('MultipleBinaryDuplicates');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('p-4');
			expect(texts).toContain('m-2');
		});
	});

	describe('Variable Resolution', () => {
		// Note: For variable-resolved classes, the duplicate warning points to the variable
		// DECLARATION (where the class string is defined), not the usage site.
		// This is consistent with how invalid class errors work for variables.

		it('should detect duplicate via variable with usage context', () => {
			// The duplicate is in the variable declaration, which is outside the function
			// So we need to find the diagnostic by looking at where "duplicateVar" is declared
			const duplicateVarDeclMatch = sourceCode.match(/const duplicateVar = 'flex'/);
			expect(duplicateVarDeclMatch).toBeTruthy();

			// Find duplicate warnings that point to the 'flex' inside duplicateVar declaration
			const varDeclStart = duplicateVarDeclMatch!.index!;
			const warnings = diagnostics.filter(
				d =>
					d.code === TAILWIND_DUPLICATE_CODE &&
					d.start !== undefined &&
					d.start >= varDeclStart &&
					d.start < varDeclStart + 50
			);
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(warnings[0].messageText).toContain('Duplicate class');
			// Should include variable usage context
			expect(warnings[0].messageText).toContain('This value comes from variable');
			expect(warnings[0].messageText).toContain('duplicateVar');
		});

		it('should detect duplicate via multiple variables', () => {
			// The duplicate is in the variable declaration for moreSpacing
			const moreSpacingMatch = sourceCode.match(/const moreSpacing = 'p-4'/);
			expect(moreSpacingMatch).toBeTruthy();

			const varDeclStart = moreSpacingMatch!.index!;
			const warnings = diagnostics.filter(
				d =>
					d.code === TAILWIND_DUPLICATE_CODE &&
					d.start !== undefined &&
					d.start >= varDeclStart &&
					d.start < varDeclStart + 50
			);
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('p-4');
		});
	});

	describe('Object Syntax', () => {
		it('should detect duplicate in object with string', () => {
			const warnings = getDuplicateWarnings('DuplicateInObjectWithString');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});
	});

	describe('Combined with Invalid Classes', () => {
		it('should show both invalid class error AND duplicate warning', () => {
			const errors = getInvalidClassErrors('InvalidAndDuplicate');
			const warnings = getDuplicateWarnings('InvalidAndDuplicate');

			// Should have error for invalid class
			expect(errors.length).toBe(1);
			expect(getTextAtDiagnostic(errors[0], sourceCode)).toBe('invalidclass');
			expect(errors[0].category).toBe(ts.DiagnosticCategory.Error);

			// Should have warning for duplicate
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(warnings[0].category).toBe(ts.DiagnosticCategory.Warning);
		});
	});

	describe('Diagnostic Format', () => {
		it('should have correct message format for duplicate warnings', () => {
			const warnings = getDuplicateWarnings('SimpleDuplicate');
			expect(warnings.length).toBe(1);
			expect(typeof warnings[0].messageText).toBe('string');
			expect(warnings[0].messageText).toBe('Duplicate class "flex"');
		});

		it('should have source set to tw-plugin', () => {
			const warnings = getDuplicateWarnings('SimpleDuplicate');
			expect(warnings[0].source).toBe('tw-plugin');
		});
	});
});
