import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes-patterns', () => {
	describe('valid-16-combined-class-bind', () => {
		it('✅ Valid: Combined static class + :class with classes matching patterns', async () => {
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
