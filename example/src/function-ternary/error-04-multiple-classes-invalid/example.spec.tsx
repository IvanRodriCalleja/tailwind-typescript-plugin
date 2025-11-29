import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('function-ternary', () => {
	describe('error-04-multiple-classes-invalid', () => {
		it('❌ Invalid: Ternary with multiple classes, one invalid in true branch', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
