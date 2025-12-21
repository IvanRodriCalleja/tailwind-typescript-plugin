import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('template-variable', () => {
	describe('error-08-invalid-variant', () => {
		it('❌ Invalid: Invalid variant with interpolation', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalidvariant:bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
