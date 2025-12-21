import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('error-10-self-closing-invalid', () => {
		it('❌ Invalid: Self-closing element with invalid class', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalidclass');
				expect(invalidClassNames).not.toContain('w-full');
			} finally {
				plugin.dispose();
			}
		});
	});
});
