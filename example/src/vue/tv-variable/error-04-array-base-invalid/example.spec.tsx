import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-variable', () => {
	describe('error-04-array-base-invalid', () => {
		it('❌ error 04 array base invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-tv-base-var');

				expect(invalidClasses).not.toContain('gap-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
