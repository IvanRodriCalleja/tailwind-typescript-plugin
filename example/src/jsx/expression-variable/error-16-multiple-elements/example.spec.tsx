import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('expression-variable', () => {
	describe('error-16-multiple-elements', () => {
		it('❌ Invalid: Multiple elements with different variables', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('bad-class');
				expect(invalidClassNames).toContain('another-bad');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('grid');
				expect(invalidClassNames).not.toContain('flex-col');
			} finally {
				plugin.dispose();
			}
		});
	});
});
