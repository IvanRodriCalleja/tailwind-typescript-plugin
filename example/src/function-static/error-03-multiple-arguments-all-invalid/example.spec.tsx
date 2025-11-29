import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('function-static', () => {
	describe('error-03-multiple-arguments-all-invalid', () => {
		it('❌ Invalid: Multiple arguments, all invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-one');
				expect(invalidClasses).toContain('invalid-two');
				expect(invalidClasses).toContain('invalid-three');
			} finally {
				plugin.dispose();
			}
		});
	});
});
