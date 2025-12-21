import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-binary', () => {
	describe('valid-03-nested-binary-valid', () => {
		it('✅ Valid: Nested binary expressions', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('text-red-500');
				expect(invalidClassNames).not.toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
