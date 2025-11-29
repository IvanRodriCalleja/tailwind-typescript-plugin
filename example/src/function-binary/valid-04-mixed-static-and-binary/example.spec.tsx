import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('function-binary', () => {
	describe('valid-04-mixed-static-and-binary', () => {
		it('✅ Valid: Mix of static strings and binary expressions', async () => {
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
