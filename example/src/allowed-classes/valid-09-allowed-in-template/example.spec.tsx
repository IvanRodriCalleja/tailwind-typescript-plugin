import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-09-allowed-in-template', () => {
		it('✅ Valid: Allowed classes in template literal', async () => {
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
