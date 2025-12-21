import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('css-variables', () => {
	describe('valid-05-css-variable-hsl', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('[--my-color:hsl(200');
				expect(invalidClasses).not.toContain('100%');
				expect(invalidClasses).not.toContain('50%)');
			} finally {
				plugin.dispose();
			}
		});
	});
});
