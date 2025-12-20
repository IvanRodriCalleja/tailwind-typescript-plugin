import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-01-no-pattern-match', () => {
		it("❌ Invalid: Class doesn't match any pattern", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('unknown-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
