import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-ternary', () => {
	describe('error-10-complex-condition-invalid', () => {
		it('❌ Invalid: Ternary with complex condition and invalid class', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-alert');
				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
