import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] array-binary', () => {
	describe('valid-15-v-bind-array', () => {
		it(`✅ Valid: v-bind:class array with binary, all valid classes`, async () => {
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
