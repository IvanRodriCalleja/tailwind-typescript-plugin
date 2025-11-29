import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('valid-05-arbitrary-values', () => {
		it('✅ Valid: Arbitrary values', async () => {
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
