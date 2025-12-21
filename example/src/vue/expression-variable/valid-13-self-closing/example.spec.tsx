import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-variable', () => {
	describe('valid-13-self-closing', () => {
		it('✅ Valid: Self-closing element with variable reference', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('w-full');
				expect(invalidClassNames).not.toContain('h-auto');
			} finally {
				plugin.dispose();
			}
		});
	});
});
