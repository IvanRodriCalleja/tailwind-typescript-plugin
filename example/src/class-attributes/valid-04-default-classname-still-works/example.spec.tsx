import { getInvalidClassDiagnostics, runPlugin } from '../../../test/folder-test-helpers';

describe('class-attributes', () => {
	describe('valid-04-default-classname-still-works', () => {
		it('✅ Valid: Default className still works when custom attributes are configured', async () => {
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
