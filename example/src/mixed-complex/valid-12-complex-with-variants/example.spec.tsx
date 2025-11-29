import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-12-complex-with-variants', () => {
		it('✅ Valid: With Tailwind variants in complex nesting', async () => {
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
