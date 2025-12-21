import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('allowed-classes', () => {
	describe('valid-01-single-allowed-class', () => {
		it('✅ Valid: Single allowed custom class', async () => {
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
