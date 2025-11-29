import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('error-02-direct-ternary-invalid-false', () => {
		it('❌ Invalid: Direct ternary with invalid in false branch', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-inactive');
				expect(invalidClassNames).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
