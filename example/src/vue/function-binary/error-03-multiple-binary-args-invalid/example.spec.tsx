import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] function-binary', () => {
	describe('error-03-multiple-binary-args-invalid', () => {
		it('❌ Invalid: Multiple binary arguments with invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-error');
				expect(invalidClasses).toContain('invalid-warning');
			} finally {
				plugin.dispose();
			}
		});
	});
});
