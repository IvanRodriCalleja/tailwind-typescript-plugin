import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-class-override', () => {
	describe('error-04-all-invalid-classes', () => {
		it('❌ error 04 all invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('completely-invalid');
				expect(invalidClasses).toContain('another-invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
