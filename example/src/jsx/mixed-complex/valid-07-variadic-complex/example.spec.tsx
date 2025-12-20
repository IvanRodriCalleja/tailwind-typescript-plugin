import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('mixed-complex', () => {
	describe('valid-07-variadic-complex', () => {
		it('✅ Valid: Variadic arrays with objects and nested arrays (clsx docs pattern)', async () => {
			const { diagnostics, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
