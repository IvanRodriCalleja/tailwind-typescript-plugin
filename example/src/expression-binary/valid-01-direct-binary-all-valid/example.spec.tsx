import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-binary', () => {
	describe('valid-01-direct-binary-all-valid', () => {
		it('✅ Valid: Direct binary expression with valid class', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('text-red-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
