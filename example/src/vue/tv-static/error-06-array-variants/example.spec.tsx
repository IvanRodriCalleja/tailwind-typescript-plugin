import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-static', () => {
	describe('error-06-array-variants', () => {
		it('❌ error 06 array variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-in-array');

				expect(invalidClasses).not.toContain('bg-blue-500');
				expect(invalidClasses).not.toContain('text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
