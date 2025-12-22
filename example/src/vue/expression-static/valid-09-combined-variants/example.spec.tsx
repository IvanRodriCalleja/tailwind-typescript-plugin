import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-static', () => {
	describe('valid-09-combined-variants', () => {
		it('✅ Valid: Combined variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('md:hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('lg:focus:ring-2');
				expect(invalidClassNames).not.toContain('dark:md:text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
