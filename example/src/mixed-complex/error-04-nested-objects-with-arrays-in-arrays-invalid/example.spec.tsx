import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('error-04-nested-objects-with-arrays-in-arrays-invalid', () => {
		it('❌ Invalid: Nested objects with arrays, invalid in nested array value', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-bg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
