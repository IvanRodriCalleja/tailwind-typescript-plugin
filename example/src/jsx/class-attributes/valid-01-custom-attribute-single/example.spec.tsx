import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('valid-01-custom-attribute-single', () => {
		it('should validate classes in custom colorStyles attribute', async () => {
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
