import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-static', () => {
	describe('error-08-invalid-class-with-valid-variant', () => {
		it('❌ Invalid: Invalid class with valid variant', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('hover:invalidclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
