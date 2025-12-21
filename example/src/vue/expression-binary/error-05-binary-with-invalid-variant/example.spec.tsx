import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-binary', () => {
	describe('error-05-binary-with-invalid-variant', () => {
		it('❌ Invalid: Binary with invalid variant', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-variant:bg-blue');
			} finally {
				plugin.dispose();
			}
		});
	});
});
