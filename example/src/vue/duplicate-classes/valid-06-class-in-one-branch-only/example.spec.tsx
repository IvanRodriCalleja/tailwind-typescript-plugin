import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-06-class-in-one-branch-only', () => {
		it('✅ Valid: Class only in ONE ternary branch', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
