import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-09-extreme-nesting', () => {
		it('✅ Valid: Extreme nesting (5+ levels)', async () => {
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
