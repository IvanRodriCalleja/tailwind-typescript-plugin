import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('literal-static', () => {
	describe('error-03-mixed-valid-invalid', () => {
		it('❌ Invalid: Mix of valid and invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalidclass');
				expect(invalidClasses).toContain('badone');
			} finally {
				plugin.dispose();
			}
		});
	});
});
