import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('valid-11-self-closing-ternary-valid', () => {
		it('✅ Valid: Self-closing element with ternary expression', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('rounded-lg');
				expect(invalidClassNames).not.toContain('rounded-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
