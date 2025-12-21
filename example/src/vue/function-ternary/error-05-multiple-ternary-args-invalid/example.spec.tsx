import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-ternary', () => {
	describe('error-05-multiple-ternary-args-invalid', () => {
		it('❌ Invalid: Multiple ternary arguments with invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-disabled');
			} finally {
				plugin.dispose();
			}
		});
	});
});
