import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-02-mixed-strings-binary-arrays', () => {
		it('✅ Valid: Mix of strings, binary, and nested arrays', async () => {
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
