import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('error-12-self-closing-ternary-invalid', () => {
		it('❌ Invalid: Self-closing element with invalid in ternary', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-style');
				expect(invalidClassNames).not.toContain('rounded-lg');
			} finally {
				plugin.dispose();
			}
		});
	});
});
