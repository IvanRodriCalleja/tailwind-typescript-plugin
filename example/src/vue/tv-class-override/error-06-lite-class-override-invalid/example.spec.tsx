import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-class-override', () => {
	describe('error-06-lite-class-override-invalid', () => {
		it('❌ error 06 lite class override invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-lite-override');

				expect(invalidClasses).not.toContain('bg-cyan-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
