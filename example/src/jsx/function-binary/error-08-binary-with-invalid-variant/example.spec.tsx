import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('function-binary', () => {
	describe('error-08-binary-with-invalid-variant', () => {
		it('❌ should report invalid-variant:bg-blue as invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-variant:bg-blue');
			} finally {
				plugin.dispose();
			}
		});
	});
});
