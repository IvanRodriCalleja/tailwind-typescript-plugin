import { getInvalidClassDiagnostics, runVuePlugin } from '../../../../test/vue-test-helpers';

describe('function-ternary', () => {
	describe('valid-11-ternary-in-classnames-function', () => {
		it('✅ Valid: Ternary in classNames() function', async () => {
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
