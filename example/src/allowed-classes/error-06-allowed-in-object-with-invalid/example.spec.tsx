import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('allowed-classes', () => {
	describe('error-06-allowed-in-object-with-invalid', () => {
		it('❌ Invalid: Invalid class as object key with allowed classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-class');
				expect(invalidClasses).not.toContain('custom-button');
			} finally {
				plugin.dispose();
			}
		});
	});
});
