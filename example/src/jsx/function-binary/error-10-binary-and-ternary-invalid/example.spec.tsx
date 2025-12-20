import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('function-binary', () => {
	describe('error-10-binary-and-ternary-invalid', () => {
		it('❌ Invalid: Binary and ternary with invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-error');
				expect(invalidClasses).toContain('invalid-active');
			} finally {
				plugin.dispose();
			}
		});
	});
});
