import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-02-wrong-prefix', () => {
		it("❌ Invalid: Wrong prefix - mycustom doesn't match custom-*", async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('mycustom-button');
			} finally {
				plugin.dispose();
			}
		});
	});
});
