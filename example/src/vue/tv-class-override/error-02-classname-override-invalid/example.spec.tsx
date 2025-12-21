import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-class-override', () => {
	describe('error-02-classname-override-invalid', () => {
		it('❌ error 02 classname override invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-classname-override');

				expect(invalidClasses).not.toContain('bg-teal-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
