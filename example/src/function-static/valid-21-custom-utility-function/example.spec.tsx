import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-21-custom-utility-function', () => {
		it('✅ Valid: Custom utility function with valid classes', async () => {
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
