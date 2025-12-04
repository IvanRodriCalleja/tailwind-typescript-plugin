import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('valid-02-custom-attribute-multiple', () => {
		it('✅ Valid: Custom attribute with multiple valid classes', async () => {
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
