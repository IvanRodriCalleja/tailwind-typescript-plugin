import { getInvalidClassDiagnostics, runPlugin } from '../../../../test/folder-test-helpers';

describe('jsx/class-attributes', () => {
	describe('valid-05-multiple-custom-attributes', () => {
		it('should validate multiple different custom attributes on same element', async () => {
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
