import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-binary', () => {
	describe('error-10-binary-and-ternary-invalid', () => {
		it('❌ Invalid: Binary and ternary with invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-error');
				expect(invalidClasses).toContain('invalid-active');
			} finally {
				plugin.dispose();
			}
		});
	});
});
