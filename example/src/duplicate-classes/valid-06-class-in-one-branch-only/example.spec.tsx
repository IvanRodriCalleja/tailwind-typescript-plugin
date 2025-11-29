import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-06-class-in-one-branch-only', () => {
		it('✅ Valid: Class only in ONE ternary branch', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
