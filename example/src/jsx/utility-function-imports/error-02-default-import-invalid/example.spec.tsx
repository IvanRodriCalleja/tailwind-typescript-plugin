import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('utility-function-imports', () => {
	describe('error-02-default-import-invalid', () => {
		it('❌ error 02 default import invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('not-a-valid-class');

				expect(invalidClasses).not.toContain('p-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
