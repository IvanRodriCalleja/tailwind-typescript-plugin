import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-variable', () => {
	describe('error-05-array-variant-with-variable-invalid', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-cva-variant-var');

				expect(invalidClasses).not.toContain('text-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
