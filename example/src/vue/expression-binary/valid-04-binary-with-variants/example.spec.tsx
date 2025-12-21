import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-binary', () => {
	describe('valid-04-binary-with-variants', () => {
		it('✅ Valid: Binary with Tailwind variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('md:text-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
