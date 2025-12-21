import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-08-multiple-objects-mixed-nesting', () => {
		it('✅ Valid: Multiple objects with mixed nested structures', async () => {
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
