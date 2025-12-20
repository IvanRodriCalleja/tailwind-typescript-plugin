import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('error-03-mixed-valid-invalid', () => {
		it('❌ Invalid: Mix of valid and invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalidclass');
				expect(invalidClasses).toContain('badone');
			} finally {
				plugin.dispose();
			}
		});
	});
});
