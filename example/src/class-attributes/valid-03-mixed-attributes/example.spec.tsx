import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('valid-03-mixed-attributes', () => {
		it('✅ Valid: Both className and custom attribute on same element', async () => {
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
