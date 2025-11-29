import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-11-allowed-in-array', () => {
		it('✅ Valid: Allowed classes in array', async () => {
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
