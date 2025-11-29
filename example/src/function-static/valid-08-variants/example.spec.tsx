import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-08-variants', () => {
		it('✅ Valid: Function with variants', async () => {
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
