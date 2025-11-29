import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('allowed-classes-patterns', () => {
	describe('error-03-wrong-suffix', () => {
		it("❌ Invalid: Wrong suffix - icons doesn't match *-icon", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('arrow-icons');
			} finally {
				plugin.dispose();
			}
		});
	});
});
