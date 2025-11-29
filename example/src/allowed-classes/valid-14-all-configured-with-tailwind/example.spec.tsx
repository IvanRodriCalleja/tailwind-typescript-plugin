import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('valid-14-all-configured-with-tailwind', () => {
		it('✅ Valid: All allowed classes with Tailwind classes', async () => {
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
