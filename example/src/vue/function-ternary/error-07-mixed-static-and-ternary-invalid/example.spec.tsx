import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] function-ternary', () => {
	describe('error-07-mixed-static-and-ternary-invalid', () => {
		it('❌ Invalid: Mix with invalid in both static and ternary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-static');
				expect(invalidClasses).toContain('invalid-ternary');
			} finally {
				plugin.dispose();
			}
		});
	});
});
