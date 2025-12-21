import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-variable', () => {
	describe('error-05-array-variant-invalid', () => {
		it('❌ error 05 array variant invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-tv-variant-var');

				expect(invalidClasses).not.toContain('text-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
