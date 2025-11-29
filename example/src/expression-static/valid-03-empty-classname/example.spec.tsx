import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('valid-03-empty-classname', () => {
		it('✅ Valid: Empty className', async () => {
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
