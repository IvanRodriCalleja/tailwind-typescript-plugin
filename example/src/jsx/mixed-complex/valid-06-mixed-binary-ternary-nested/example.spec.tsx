import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-06-mixed-binary-ternary-nested', () => {
		it('✅ Valid: Binary and ternary mixed in nested structures', async () => {
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
