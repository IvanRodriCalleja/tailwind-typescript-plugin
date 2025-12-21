import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-04-partial-match', () => {
		it("❌ Invalid: exact-match-extra doesn't match exact-match (exact matches are exact)", async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('exact-match-extra');
			} finally {
				plugin.dispose();
			}
		});
	});
});
