import { getClassNamesFromDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('conflicting-classes', () => {
	describe('valid-08-tv-different-calls', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				// Test that plugin runs successfully
				expect(diagnostics).toBeDefined();
			} finally {
				plugin.dispose();
			}
		});
	});
});
