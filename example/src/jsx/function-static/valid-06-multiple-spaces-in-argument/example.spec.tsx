import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-06-multiple-spaces-in-argument', () => {
		it('✅ Valid: Multiple spaces in argument', async () => {
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
