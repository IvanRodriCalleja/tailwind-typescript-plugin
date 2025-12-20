import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('error-08-invalid-class-with-valid-variant', () => {
		it('❌ Invalid: Invalid class with valid variant', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('hover:invalidclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
