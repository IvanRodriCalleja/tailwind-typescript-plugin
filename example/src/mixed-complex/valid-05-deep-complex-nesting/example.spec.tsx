import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-05-deep-complex-nesting', () => {
		it('✅ Valid: Multiple levels of nesting with all patterns', async () => {
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
