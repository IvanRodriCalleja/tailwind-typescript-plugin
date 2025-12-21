import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('utility-function-imports', () => {
	describe('error-02-default-import-invalid', () => {
		it('❌ error 02 default import invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('not-a-valid-class');

				expect(invalidClasses).not.toContain('p-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
