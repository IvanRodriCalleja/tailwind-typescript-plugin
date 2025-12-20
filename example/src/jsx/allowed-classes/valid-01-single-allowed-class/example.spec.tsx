import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-01-single-allowed-class', () => {
		it('✅ Valid: Single allowed custom class', async () => {
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
