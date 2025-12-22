import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-static', () => {
	describe('error-10-lite-variants', () => {
		it('❌ error 10 lite variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-lite-variant');

				expect(invalidClasses).not.toContain('bg-red-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
