import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('error-06-invalid-middle', () => {
		it('❌ Invalid: Invalid class in the middle', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalidclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
