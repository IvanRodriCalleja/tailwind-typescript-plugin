import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-03-empty-classname', () => {
		it('✅ Valid: Empty className (no duplicates possible)', async () => {
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
