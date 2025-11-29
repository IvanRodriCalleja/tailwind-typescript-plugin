import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('valid-01-direct-ternary-all-valid', () => {
		it('✅ Valid: Direct ternary expression with all valid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('bg-blue-500');
				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
