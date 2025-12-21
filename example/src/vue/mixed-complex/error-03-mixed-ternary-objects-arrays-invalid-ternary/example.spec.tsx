import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('mixed-complex', () => {
	describe('error-03-mixed-ternary-objects-arrays-invalid-ternary', () => {
		it('❌ Invalid: Mix with invalid in ternary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-grid');
			} finally {
				plugin.dispose();
			}
		});
	});
});
