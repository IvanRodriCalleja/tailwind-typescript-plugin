import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('function-ternary', () => {
	describe('error-07-mixed-static-and-ternary-invalid', () => {
		it('❌ Invalid: Mix with invalid in both static and ternary', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-static');
				expect(invalidClasses).toContain('invalid-ternary');
			} finally {
				plugin.dispose();
			}
		});
	});
});
