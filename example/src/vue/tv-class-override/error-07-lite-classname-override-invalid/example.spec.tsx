import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-class-override', () => {
	describe('error-07-lite-classname-override-invalid', () => {
		it('❌ error 07 lite classname override invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-lite-classname');

				expect(invalidClasses).not.toContain('bg-orange-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
