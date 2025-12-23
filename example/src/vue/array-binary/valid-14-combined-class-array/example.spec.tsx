import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] array-binary', () => {
	describe('valid-14-combined-class-array', () => {
		it(`✅ Valid: Combined static class + :class array with binary, all valid`, async () => {
			const { diagnostics, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBe(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
