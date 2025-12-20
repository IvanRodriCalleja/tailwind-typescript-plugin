import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-05-allowed-class-first', () => {
		it('✅ Valid: Allowed class at the beginning', async () => {
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
