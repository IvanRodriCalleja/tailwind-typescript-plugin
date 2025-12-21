import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-10-all-patterns-combined', () => {
		it('✅ Valid: All patterns combined (strings, binary, ternary, objects, arrays, nested)', async () => {
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
