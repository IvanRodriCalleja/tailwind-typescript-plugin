import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-11-self-closing-binary-valid', () => {
		it('✅ Valid: Self-closing element with binary expression', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('rounded-lg');
				expect(invalidClassNames).not.toContain('shadow-md');
			} finally {
				plugin.dispose();
			}
		});
	});
});
