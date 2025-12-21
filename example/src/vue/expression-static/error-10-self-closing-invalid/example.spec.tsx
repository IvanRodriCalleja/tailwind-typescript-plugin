import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-static', () => {
	describe('error-10-self-closing-invalid', () => {
		it('❌ Invalid: Self-closing element with invalid class', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalidclass');
				expect(invalidClassNames).not.toContain('w-full');
			} finally {
				plugin.dispose();
			}
		});
	});
});
