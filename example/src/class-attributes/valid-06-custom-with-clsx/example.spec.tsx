import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('valid-06-custom-with-clsx', () => {
		it('✅ Valid: Custom attribute with clsx function call', async () => {
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
