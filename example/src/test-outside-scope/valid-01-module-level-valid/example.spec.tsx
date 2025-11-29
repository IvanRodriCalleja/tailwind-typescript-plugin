import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('test-outside-scope', () => {
	describe('valid-01-module-level-valid', () => {
		it('✅ should validate module-level variable with valid classes', async () => {
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
