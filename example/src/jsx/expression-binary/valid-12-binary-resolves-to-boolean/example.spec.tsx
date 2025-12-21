import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-12-binary-resolves-to-boolean', () => {
		it('✅ Valid: Binary that resolves to boolean (falsy case)', async () => {
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
