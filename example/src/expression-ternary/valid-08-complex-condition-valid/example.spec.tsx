import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('valid-08-complex-condition-valid', () => {
		it('✅ Valid: Ternary with complex condition', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('bg-red-500');
				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
