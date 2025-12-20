import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-02-wrong-prefix', () => {
		it("❌ Invalid: Wrong prefix - mycustom doesn't match custom-*", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('mycustom-button');
			} finally {
				plugin.dispose();
			}
		});
	});
});
