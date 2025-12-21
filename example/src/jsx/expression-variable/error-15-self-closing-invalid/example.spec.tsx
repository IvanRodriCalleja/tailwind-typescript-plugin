import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-variable', () => {
	describe('error-15-self-closing-invalid', () => {
		it('❌ Invalid: Self-closing element with invalid variable', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-img-class');
				expect(invalidClassNames).not.toContain('w-full');
			} finally {
				plugin.dispose();
			}
		});
	});
});
