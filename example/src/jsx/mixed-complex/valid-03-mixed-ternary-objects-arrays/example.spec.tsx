import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-03-mixed-ternary-objects-arrays', () => {
		it('✅ Valid: Mix of ternary, objects, and arrays', async () => {
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
