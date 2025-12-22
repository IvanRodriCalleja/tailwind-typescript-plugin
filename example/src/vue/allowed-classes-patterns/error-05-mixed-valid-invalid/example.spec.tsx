import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes-patterns', () => {
	describe('error-05-mixed-valid-invalid', () => {
		it(`❌ Invalid: Mix of valid patterns and invalid class`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('not-allowed');
				expect(invalidClassNames).not.toContain('custom-header');
				expect(invalidClassNames).not.toContain('close-icon');
			} finally {
				plugin.dispose();
			}
		});
	});
});
