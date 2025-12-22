import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes-patterns', () => {
	describe('valid-17-ref-reactive', () => {
		it('✅ Valid: ref and reactive with classes matching patterns', async () => {
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
