import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-06-allowed-class-middle', () => {
		it('✅ Valid: Allowed class in the middle', async () => {
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
