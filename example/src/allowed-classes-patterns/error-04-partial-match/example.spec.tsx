import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-04-partial-match', () => {
		it("❌ Invalid: exact-match-extra doesn't match exact-match (exact matches are exact)", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('exact-match-extra');
			} finally {
				plugin.dispose();
			}
		});
	});
});
