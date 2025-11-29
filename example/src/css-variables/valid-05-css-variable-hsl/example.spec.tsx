import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('css-variables', () => {
	describe('valid-05-css-variable-hsl', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('[--my-color:hsl(200');
				expect(invalidClasses).not.toContain('100%');
				expect(invalidClasses).not.toContain('50%)');
			} finally {
				plugin.dispose();
			}
		});
	});
});
