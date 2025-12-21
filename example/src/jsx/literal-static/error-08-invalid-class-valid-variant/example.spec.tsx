import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('error-08-invalid-class-valid-variant', () => {
		it('❌ should report hover:invalidclass as invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('hover:invalidclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
