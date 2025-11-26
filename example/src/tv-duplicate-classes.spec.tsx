import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import { getDiagnosticsForFunction, getTextAtDiagnostic, runPluginOnFile } from '../test/test-helpers';

// Diagnostic codes from DiagnosticService
const TAILWIND_DUPLICATE_CODE = 90002;

describe('E2E Tests - TV Duplicate Class Detection', () => {
	const testFile = path.join(__dirname, 'tv-duplicate-classes.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
	});

	// Helper to get duplicate warnings for a function
	function getDuplicateWarnings(functionName: string): ts.Diagnostic[] {
		return getDiagnosticsForFunction(diagnostics, sourceCode, functionName).filter(
			d => d.code === TAILWIND_DUPLICATE_CODE
		);
	}

	describe('Duplicates within base', () => {
		it('should detect duplicate in tv() base string', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInBase');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(warnings[0].category).toBe(ts.DiagnosticCategory.Warning);
		});

		it('should detect duplicate in tv() base array', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInBaseArray');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});
	});

	describe('Duplicates across base and variants', () => {
		it('should detect duplicate across base and variant', () => {
			const warnings = getDuplicateWarnings('TvDuplicateBaseAndVariant');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect multiple duplicates across base and variants', () => {
			const warnings = getDuplicateWarnings('TvMultipleDuplicatesAcrossVariants');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts).toContain('flex');
			expect(texts).toContain('items-center');
		});
	});

	describe('Duplicates in compoundVariants', () => {
		it('should detect duplicate in compoundVariant class', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInCompoundVariant');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect duplicate in compoundVariant className', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInCompoundVariantClassName');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('p-4');
		});
	});

	describe('Duplicates in slots', () => {
		it('should detect duplicate within same slot', () => {
			const warnings = getDuplicateWarnings('TvDuplicateWithinSlot');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});

		it('should detect duplicate across slots', () => {
			const warnings = getDuplicateWarnings('TvDuplicateAcrossSlots');
			expect(warnings.length).toBe(1);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
		});
	});

	describe('No duplicates (valid cases)', () => {
		it('should not flag same class in different tv() calls', () => {
			const warnings = getDuplicateWarnings('TvNoDuplicateDifferentCalls');
			expect(warnings.length).toBe(0);
		});

		it('should not flag unique classes', () => {
			const warnings = getDuplicateWarnings('TvNoDuplicates');
			expect(warnings.length).toBe(0);
		});

		it('should not flag similar but different classes', () => {
			const warnings = getDuplicateWarnings('TvSimilarButDifferent');
			expect(warnings.length).toBe(0);
		});
	});

	describe('Diagnostic format', () => {
		it('should have correct message format', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInBase');
			expect(warnings.length).toBe(1);
			expect(typeof warnings[0].messageText).toBe('string');
			expect(warnings[0].messageText).toBe('Duplicate class "flex"');
		});

		it('should have source set to tw-plugin', () => {
			const warnings = getDuplicateWarnings('TvDuplicateInBase');
			expect(warnings[0].source).toBe('tw-plugin');
		});
	});
});
