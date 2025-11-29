import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-05-binary-with-arbitrary-values', () => {
		it('✅ Valid: Binary with arbitrary values', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('h-[50vh');
			} finally {
				plugin.dispose();
			}
		});
	});
});
