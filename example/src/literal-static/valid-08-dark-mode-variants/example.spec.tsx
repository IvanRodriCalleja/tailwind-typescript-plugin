import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('valid-08-dark-mode-variants', () => {
		it('✅ Valid: Dark mode variants', async () => {
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
