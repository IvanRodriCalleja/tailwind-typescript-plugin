import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-static', () => {
	describe('error-03-multiple-arguments-all-invalid', () => {
		it('❌ Invalid: Multiple arguments, all invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-one');
				expect(invalidClasses).toContain('invalid-two');
				expect(invalidClasses).toContain('invalid-three');
			} finally {
				plugin.dispose();
			}
		});
	});
});
