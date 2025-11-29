import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-08-binary-with-empty-string', () => {
		it('✅ Valid: Binary with empty string (no classes to validate)', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
