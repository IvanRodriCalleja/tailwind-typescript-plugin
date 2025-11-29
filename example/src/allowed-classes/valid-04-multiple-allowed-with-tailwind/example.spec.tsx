import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-04-multiple-allowed-with-tailwind', () => {
		it('✅ Valid: Multiple allowed classes with Tailwind', async () => {
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
