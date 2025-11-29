import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('valid-02-no-duplicates', () => {
		it('✅ valid 02 no duplicates', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
