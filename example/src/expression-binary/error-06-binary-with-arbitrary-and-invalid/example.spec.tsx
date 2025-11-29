import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('error-06-binary-with-arbitrary-and-invalid', () => {
		it('❌ Invalid: Binary with mix of arbitrary and invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-size');
				expect(invalidClassNames).not.toContain('h-[50vh');
			} finally {
				plugin.dispose();
			}
		});
	});
});
