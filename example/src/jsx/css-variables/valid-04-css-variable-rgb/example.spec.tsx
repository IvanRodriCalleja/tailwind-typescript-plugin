import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('css-variables', () => {
	describe('valid-04-css-variable-rgb', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('[--my-color:rgb(255');
				expect(invalidClasses).not.toContain('0');
				expect(invalidClasses).not.toContain('0)');
			} finally {
				plugin.dispose();
			}
		});
	});
});
