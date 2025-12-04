import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('valid-05-multiple-custom-attributes', () => {
		it('✅ Valid: Multiple custom attributes configured', async () => {
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
