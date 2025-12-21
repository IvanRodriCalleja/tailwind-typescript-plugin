import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-binary', () => {
	describe('valid-02-direct-binary-or-valid', () => {
		it('✅ Valid: Direct OR binary expression', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
