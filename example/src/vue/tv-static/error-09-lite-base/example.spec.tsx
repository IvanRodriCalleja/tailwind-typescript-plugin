import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-static', () => {
	describe('error-09-lite-base', () => {
		it('❌ error 09 lite base', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-lite-class');

				expect(invalidClasses).not.toContain('font-bold');
				expect(invalidClasses).not.toContain('text-blue-600');
			} finally {
				plugin.dispose();
			}
		});
	});
});
