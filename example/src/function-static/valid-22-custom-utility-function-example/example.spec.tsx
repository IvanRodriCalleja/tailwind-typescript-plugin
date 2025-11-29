import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('valid-22-custom-utility-function-example', () => {
		it('✅ Valid: Custom utility function (example - requires config)', async () => {
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
