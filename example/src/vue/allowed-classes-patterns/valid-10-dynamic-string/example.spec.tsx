import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes-patterns', () => {
	describe('valid-10-dynamic-string', () => {
		it('✅ Valid: Dynamic string with classes matching patterns', async () => {
			const { diagnostics, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
