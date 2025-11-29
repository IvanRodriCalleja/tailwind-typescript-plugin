import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-04-nested-objects-with-arrays-in-arrays', () => {
		it('✅ Valid: Nested objects with array values inside arrays', async () => {
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
