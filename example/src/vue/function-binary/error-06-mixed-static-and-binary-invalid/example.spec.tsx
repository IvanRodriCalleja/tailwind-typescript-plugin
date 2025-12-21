import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-binary', () => {
	describe('error-06-mixed-static-and-binary-invalid', () => {
		it('❌ Invalid: Mix with invalid in both static and binary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-static');
				expect(invalidClasses).toContain('invalid-binary');
			} finally {
				plugin.dispose();
			}
		});
	});
});
