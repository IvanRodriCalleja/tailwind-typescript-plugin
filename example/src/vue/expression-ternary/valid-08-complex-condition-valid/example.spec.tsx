import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-ternary', () => {
	describe('valid-08-complex-condition-valid', () => {
		it('✅ Valid: Ternary with complex condition', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('bg-red-500');
				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
