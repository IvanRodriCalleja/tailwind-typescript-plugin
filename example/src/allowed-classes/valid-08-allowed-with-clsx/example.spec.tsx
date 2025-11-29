import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-08-allowed-with-clsx', () => {
		it('✅ Valid: Allowed classes with clsx', async () => {
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
