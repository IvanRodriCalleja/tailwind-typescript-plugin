import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-binary', () => {
	describe('error-10-self-closing-binary-invalid', () => {
		it('❌ Invalid: Self-closing element with invalid in binary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-style');
				expect(invalidClassNames).not.toContain('rounded-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
