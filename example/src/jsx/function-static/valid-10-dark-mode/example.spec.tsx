import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-10-dark-mode', () => {
		it('✅ Valid: Function with dark mode variants', async () => {
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
