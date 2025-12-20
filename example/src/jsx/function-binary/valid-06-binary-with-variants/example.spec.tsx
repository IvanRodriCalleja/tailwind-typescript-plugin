import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('function-binary', () => {
	describe('valid-06-binary-with-variants', () => {
		it('✅ Valid: Binary with Tailwind variants', async () => {
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
