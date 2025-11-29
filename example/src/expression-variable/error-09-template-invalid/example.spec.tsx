import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-variable', () => {
	describe('error-09-template-invalid', () => {
		it('❌ Invalid: Variable with no-substitution template literal containing invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-template');
				expect(invalidClassNames).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
