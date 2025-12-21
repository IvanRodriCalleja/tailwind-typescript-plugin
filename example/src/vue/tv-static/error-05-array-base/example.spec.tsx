import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-static', () => {
	describe('error-05-array-base', () => {
		it('❌ error 05 array base', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-array-class');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
