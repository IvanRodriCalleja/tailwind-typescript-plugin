import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-07-variable-ternary-one-branch', () => {
		it("✅ Valid: Variable ternary with 'flex' in only ONE branch", async () => {
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
