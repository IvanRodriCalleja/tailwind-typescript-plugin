import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('[Vue] array-binary', () => {
	describe('valid-13-array-direct', () => {
		it(`✅ Valid: Direct array syntax without cn/clsx, all valid classes`, async () => {
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
