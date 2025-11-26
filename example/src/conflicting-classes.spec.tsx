import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { getDiagnosticsForFunction, getTextAtDiagnostic, runPluginOnFile } from '../test/test-helpers';

// Diagnostic codes from DiagnosticService
const TAILWIND_DIAGNOSTIC_CODE = 90001;
const TAILWIND_DUPLICATE_CODE = 90002;
const TAILWIND_CONFLICT_CODE = 90004;

describe('E2E Tests - Conflicting Class Detection', () => {
	const testFile = path.join(__dirname, 'conflicting-classes.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile, { utilityFunctions: ['clsx', 'cn'] });
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
	});

	// Helper to get conflict warnings for a function
	function getConflictWarnings(functionName: string): ts.Diagnostic[] {
		return getDiagnosticsForFunction(diagnostics, sourceCode, functionName).filter(
			d => d.code === TAILWIND_CONFLICT_CODE
		);
	}

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

	describe('Text Alignment Conflicts', () => {
		it('should detect text-left vs text-center conflict on BOTH classes', () => {
			const warnings = getConflictWarnings('TextAlignConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-center');
			expect(warnings.every(w => w.category === ts.DiagnosticCategory.Warning)).toBe(true);
			expect(warnings.every(w => (w.messageText as string).includes('text-align'))).toBe(true);
		});

		it('should detect multiple text alignment conflicts on ALL classes', () => {
			const warnings = getConflictWarnings('MultipleTextAlignConflicts');
			expect(warnings.length).toBe(3);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-center');
			expect(texts).toContain('text-right');
		});

		it('should detect text-justify conflict on both classes', () => {
			const warnings = getConflictWarnings('TextJustifyConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-justify');
		});
	});

	describe('Display Conflicts', () => {
		it('should detect flex vs block conflict on both', () => {
			const warnings = getConflictWarnings('FlexBlockConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('block');
			expect(warnings.every(w => (w.messageText as string).includes('display'))).toBe(true);
		});

		it('should detect grid vs flex conflict on both', () => {
			const warnings = getConflictWarnings('GridFlexConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('grid');
			expect(texts).toContain('flex');
		});

		it('should detect hidden vs flex conflict on both', () => {
			const warnings = getConflictWarnings('HiddenFlexConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('hidden');
		});

		it('should detect inline-block vs block conflict on both', () => {
			const warnings = getConflictWarnings('InlineBlockConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('inline-block');
			expect(texts).toContain('block');
		});
	});

	describe('Position Conflicts', () => {
		it('should detect absolute vs relative conflict on both', () => {
			const warnings = getConflictWarnings('AbsoluteRelativeConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('absolute');
			expect(texts).toContain('relative');
			expect(warnings.every(w => (w.messageText as string).includes('position'))).toBe(true);
		});

		it('should detect sticky vs fixed conflict on both', () => {
			const warnings = getConflictWarnings('StickyFixedConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('sticky');
			expect(texts).toContain('fixed');
		});

		it('should detect static vs absolute conflict on both', () => {
			const warnings = getConflictWarnings('StaticAbsoluteConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('static');
			expect(texts).toContain('absolute');
		});
	});

	describe('Flex Direction Conflicts', () => {
		it('should detect flex-row vs flex-col conflict on both', () => {
			const warnings = getConflictWarnings('FlexDirectionConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex-row');
			expect(texts).toContain('flex-col');
			expect(warnings.every(w => (w.messageText as string).includes('flex-direction'))).toBe(true);
		});

		it('should detect flex-row-reverse vs flex-col conflict on both', () => {
			const warnings = getConflictWarnings('FlexReverseConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex-row-reverse');
			expect(texts).toContain('flex-col');
		});
	});

	describe('Justify Content Conflicts', () => {
		it('should detect justify-start vs justify-center conflict on both', () => {
			const warnings = getConflictWarnings('JustifyContentConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('justify-start');
			expect(texts).toContain('justify-center');
			expect(warnings.every(w => (w.messageText as string).includes('justify-content'))).toBe(true);
		});

		it('should detect justify-between vs justify-around conflict on both', () => {
			const warnings = getConflictWarnings('JustifyBetweenAroundConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('justify-between');
			expect(texts).toContain('justify-around');
		});
	});

	describe('Align Items Conflicts', () => {
		it('should detect items-start vs items-center conflict on both', () => {
			const warnings = getConflictWarnings('AlignItemsConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('items-start');
			expect(texts).toContain('items-center');
			expect(warnings.every(w => (w.messageText as string).includes('align-items'))).toBe(true);
		});

		it('should detect items-stretch vs items-baseline conflict on both', () => {
			const warnings = getConflictWarnings('ItemsStretchBaselineConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('items-stretch');
			expect(texts).toContain('items-baseline');
		});
	});

	describe('Other Conflicts', () => {
		it('should detect visibility conflict on both', () => {
			const warnings = getConflictWarnings('VisibilityConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('visible');
			expect(texts).toContain('invisible');
			expect(warnings.every(w => (w.messageText as string).includes('visibility'))).toBe(true);
		});

		it('should detect overflow conflict on both', () => {
			const warnings = getConflictWarnings('OverflowConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('overflow-hidden');
			expect(texts).toContain('overflow-scroll');
		});

		it('should detect overflow-auto vs overflow-visible conflict on both', () => {
			const warnings = getConflictWarnings('OverflowAutoVisibleConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('overflow-auto');
			expect(texts).toContain('overflow-visible');
		});

		it('should detect font style conflict on both', () => {
			const warnings = getConflictWarnings('FontStyleConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('italic');
			expect(texts).toContain('not-italic');
			expect(warnings.every(w => (w.messageText as string).includes('font-style'))).toBe(true);
		});

		it('should detect text transform conflict on both', () => {
			const warnings = getConflictWarnings('TextTransformConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('uppercase');
			expect(texts).toContain('lowercase');
			expect(warnings.every(w => (w.messageText as string).includes('text-transform'))).toBe(true);
		});

		it('should detect capitalize vs normal-case conflict on both', () => {
			const warnings = getConflictWarnings('CapitalizeNormalConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('capitalize');
			expect(texts).toContain('normal-case');
		});

		it('should detect whitespace conflict on both', () => {
			const warnings = getConflictWarnings('WhitespaceConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('whitespace-nowrap');
			expect(texts).toContain('whitespace-normal');
		});

		it('should detect text-wrap conflict on both', () => {
			const warnings = getConflictWarnings('TextWrapConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-wrap');
			expect(texts).toContain('text-nowrap');
		});

		it('should detect cursor conflict on both', () => {
			const warnings = getConflictWarnings('CursorConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('cursor-pointer');
			expect(texts).toContain('cursor-not-allowed');
		});
	});

	describe('No False Positives', () => {
		it('should not flag different utility types', () => {
			const warnings = getConflictWarnings('NoConflicts');
			expect(warnings.length).toBe(0);
		});

		it('should not flag same class in different elements', () => {
			const warnings = getConflictWarnings('SameClassDifferentElements');
			expect(warnings.length).toBe(0);
		});

		it('should not flag similar but non-conflicting classes', () => {
			const warnings = getConflictWarnings('SimilarButNotConflicting');
			expect(warnings.length).toBe(0);
		});

		it('should not flag duplicates as conflicts', () => {
			const conflicts = getConflictWarnings('DuplicateNotConflict');
			const duplicates = getDuplicateWarnings('DuplicateNotConflict');
			expect(conflicts.length).toBe(0);
			expect(duplicates.length).toBe(1);
		});
	});

	describe('Responsive Variants', () => {
		it('should detect conflicts with same responsive variant on both', () => {
			const warnings = getConflictWarnings('ResponsiveConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('md:text-left');
			expect(texts).toContain('md:text-center');
		});

		it('should not flag different breakpoints as conflict', () => {
			const warnings = getConflictWarnings('DifferentBreakpoints');
			expect(warnings.length).toBe(0);
		});

		it('should detect conflicts with same state variant on both', () => {
			const warnings = getConflictWarnings('StateVariantConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('hover:block');
			expect(texts).toContain('hover:flex');
		});
	});

	describe('Ternary Conditional Expressions', () => {
		it('should not flag conflicts in different ternary branches', () => {
			const warnings = getConflictWarnings('TernaryMutuallyExclusive');
			expect(warnings.length).toBe(0);
		});

		it('should flag root class conflicting with branch class (both flagged)', () => {
			const warnings = getConflictWarnings('RootConflictWithBranch');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-center');
		});

		it('should flag conflicts within same branch (both flagged)', () => {
			const warnings = getConflictWarnings('ConflictWithinSameBranch');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-center');
		});
	});

	describe('Utility Function Calls', () => {
		it('should detect conflict in clsx arguments (both flagged)', () => {
			const warnings = getConflictWarnings('ConflictInClsx');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('block');
		});

		it('should detect conflict in cn function (both flagged)', () => {
			const warnings = getConflictWarnings('ConflictInCn');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('text-left');
			expect(texts).toContain('text-right');
		});
	});

	describe('tailwind-variants tv() Conflicts', () => {
		it('should detect conflicts in tv() base property', () => {
			const warnings = getConflictWarnings('TvBaseConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('block');
		});

		it('should NOT detect conflicts between tv() base and variants', () => {
			const warnings = getConflictWarnings('TvBaseVariantNoConflict');
			// Base vs variant should NOT conflict - variants are designed to override base
			expect(warnings.length).toBe(0);
		});

		it('should NOT detect conflicts between different tv() calls', () => {
			const warnings = getConflictWarnings('TvDifferentCallsNoConflict');
			expect(warnings.length).toBe(0);
		});
	});

	describe('class-variance-authority cva() Conflicts', () => {
		it('should detect conflicts in cva() base array', () => {
			const warnings = getConflictWarnings('CvaBaseConflict');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('grid');
		});

		it('should NOT detect conflicts between cva() base and variants', () => {
			const warnings = getConflictWarnings('CvaBaseVariantNoConflict');
			// Base vs variant should NOT conflict - variants are designed to override base
			expect(warnings.length).toBe(0);
		});
	});

	describe('Combined with Other Issues', () => {
		it('should detect both invalid class and conflict (all flagged)', () => {
			const conflicts = getConflictWarnings('InvalidAndConflict');
			const errors = getInvalidClassErrors('InvalidAndConflict');
			expect(conflicts.length).toBe(2);
			expect(errors.length).toBe(1);
			const conflictTexts = conflicts.map(c => getTextAtDiagnostic(c, sourceCode));
			expect(conflictTexts).toContain('flex');
			expect(conflictTexts).toContain('block');
			expect(getTextAtDiagnostic(errors[0], sourceCode)).toBe('invalidclass');
		});

		it('should detect both duplicate and conflict (all flagged)', () => {
			const conflicts = getConflictWarnings('DuplicateAndConflict');
			const duplicates = getDuplicateWarnings('DuplicateAndConflict');
			// 2 conflicts (flex vs block) + the duplicate flex also conflicts with block
			expect(conflicts.length).toBeGreaterThanOrEqual(2);
			expect(duplicates.length).toBe(1);
			const conflictTexts = conflicts.map(c => getTextAtDiagnostic(c, sourceCode));
			expect(conflictTexts).toContain('block');
			expect(getTextAtDiagnostic(duplicates[0], sourceCode)).toBe('flex');
		});
	});
});
