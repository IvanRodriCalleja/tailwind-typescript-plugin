import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-11-cn-function', () => {
		it('✅ Valid: Using cn() function', async () => {
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
