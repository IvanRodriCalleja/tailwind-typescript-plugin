import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-static', () => {
	describe('valid-08-dark-mode-variants', () => {
		it('✅ Valid: Dark mode variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('bg-white');
				expect(invalidClassNames).not.toContain('dark:bg-gray-900');
				expect(invalidClassNames).not.toContain('text-black');
				expect(invalidClassNames).not.toContain('dark:text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
