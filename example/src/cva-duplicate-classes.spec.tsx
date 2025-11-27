import * as ts from 'typescript/lib/tsserverlibrary';
import path from 'path';

import {
	getDiagnosticsForFunction,
	getTextAtDiagnostic,
	PluginInstance,
	runPluginOnFile
} from '../test/test-helpers';

// Diagnostic codes from DiagnosticService
const TAILWIND_DUPLICATE_CODE = 90002;

describe('E2E Tests - CVA Duplicate Class Detection', () => {
	const testFile = path.join(__dirname, 'cva-duplicate-classes.tsx');
	let diagnostics: ts.Diagnostic[];
	let sourceCode: string;
	let plugin: PluginInstance;

	beforeAll(async () => {
		const result = await runPluginOnFile(testFile);
		diagnostics = result.diagnostics;
		sourceCode = result.sourceCode;
		plugin = result.plugin;
	});

	afterAll(() => {
		// Clean up plugin to close file watchers
		plugin.dispose();
	});

	// Helper to get duplicate warnings for a function
	function getDuplicateWarnings(functionName: string): ts.Diagnostic[] {
		return getDiagnosticsForFunction(diagnostics, sourceCode, functionName).filter(
			d => d.code === TAILWIND_DUPLICATE_CODE
		);
	}

	describe('Duplicates within base', () => {
		it('should detect duplicate in cva() base string', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInBaseString');
			expect(warnings.length).toBe(2);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(getTextAtDiagnostic(warnings[1], sourceCode)).toBe('flex');
			expect(warnings[0].category).toBe(ts.DiagnosticCategory.Warning);
		});

		it('should detect duplicate in cva() base array', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInBaseArray');
			expect(warnings.length).toBe(2);
			expect(getTextAtDiagnostic(warnings[0], sourceCode)).toBe('flex');
			expect(getTextAtDiagnostic(warnings[1], sourceCode)).toBe('flex');
		});

		it('should detect multiple duplicates in base', () => {
			const warnings = getDuplicateWarnings('CvaMultipleDuplicatesInBase');
			expect(warnings.length).toBe(4);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.filter(t => t === 'flex').length).toBe(2);
			expect(texts.filter(t => t === 'p-4').length).toBe(2);
		});
	});

	describe('Duplicates across base and variants', () => {
		it('should detect duplicate across base and variant (array)', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateBaseAndVariant');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'flex')).toBe(true);
		});

		it('should detect duplicate across base and variant (string)', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateBaseAndVariantString');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'items-center')).toBe(true);
		});

		it('should detect duplicate across multiple variants', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateAcrossVariants');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'flex')).toBe(true);
		});
	});

	describe('Duplicates in compoundVariants', () => {
		it('should detect duplicate in compoundVariant class', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInCompoundVariant');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'flex')).toBe(true);
		});

		it('should detect duplicate in compoundVariant className', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInCompoundVariantClassName');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'p-4')).toBe(true);
		});

		it('should detect duplicate across compoundVariants', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateAcrossCompoundVariants');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'font-bold')).toBe(true);
		});
	});

	describe('Duplicates within same variant', () => {
		it('should detect duplicate within same variant value', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateWithinVariant');
			expect(warnings.length).toBe(2);
			const texts = warnings.map(w => getTextAtDiagnostic(w, sourceCode));
			expect(texts.every(t => t === 'bg-blue-500')).toBe(true);
		});
	});

	describe('No duplicates (valid cases)', () => {
		it('should not flag same class in different cva() calls', () => {
			const warnings = getDuplicateWarnings('CvaNoDuplicateDifferentCalls');
			expect(warnings.length).toBe(0);
		});

		it('should not flag unique classes', () => {
			const warnings = getDuplicateWarnings('CvaNoDuplicates');
			expect(warnings.length).toBe(0);
		});

		it('should not flag similar but different classes', () => {
			const warnings = getDuplicateWarnings('CvaSimilarButDifferent');
			expect(warnings.length).toBe(0);
		});

		it('should handle boolean variants with null correctly', () => {
			const warnings = getDuplicateWarnings('CvaBooleanVariantsNoNull');
			expect(warnings.length).toBe(0);
		});
	});

	describe('Diagnostic format', () => {
		it('should have correct message format', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInBaseString');
			expect(warnings.length).toBe(2);
			expect(typeof warnings[0].messageText).toBe('string');
			expect(warnings[0].messageText).toBe('Duplicate class "flex"');
		});

		it('should have source set to tw-plugin', () => {
			const warnings = getDuplicateWarnings('CvaDuplicateInBaseString');
			expect(warnings[0].source).toBe('tw-plugin');
		});
	});
});
