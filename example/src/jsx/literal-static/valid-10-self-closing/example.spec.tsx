import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('valid-10-self-closing', () => {
		it('✅ Valid: Self-closing element with valid classes', async () => {
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
