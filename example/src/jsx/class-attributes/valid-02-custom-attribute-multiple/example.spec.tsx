import { getInvalidClassDiagnostics, runPlugin } from '../../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('valid-02-custom-attribute-multiple', () => {
		it('should validate multiple classes in custom attribute', async () => {
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
