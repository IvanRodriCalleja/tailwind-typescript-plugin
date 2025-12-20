import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('valid-06-state-variants', () => {
		it('✅ Valid: Classes with variants (hover, focus, etc.)', async () => {
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
