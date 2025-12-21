import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('literal-static', () => {
	describe('error-07-invalid-variant-name', () => {
		it('❌ should report invalidvariant:bg-blue-500 as invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalidvariant:bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
