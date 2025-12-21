import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('valid-01-no-duplicate-different-calls', () => {
		it('✅ valid 01 no duplicate different calls', async () => {
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
