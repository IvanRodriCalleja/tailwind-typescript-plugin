import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('function-binary', () => {
	describe('valid-08-binary-and-ternary', () => {
		it('✅ Valid: Binary and ternary combined in function', async () => {
			const { diagnostics, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
