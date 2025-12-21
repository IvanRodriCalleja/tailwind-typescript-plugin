import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-static', () => {
	describe('error-02-variants', () => {
		it('❌ error 02 variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-variant-class');

				expect(invalidClasses).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
