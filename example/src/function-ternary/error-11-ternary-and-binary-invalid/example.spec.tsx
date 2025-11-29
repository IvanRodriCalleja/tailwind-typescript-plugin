import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('function-ternary', () => {
	describe('error-11-ternary-and-binary-invalid', () => {
		it('❌ Invalid: Ternary and binary with invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-error');
			} finally {
				plugin.dispose();
			}
		});
	});
});
