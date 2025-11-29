import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('css-variables', () => {
	describe('valid-11-css-variable-usage-padding', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('p-[var(--spacing)');
			} finally {
				plugin.dispose();
			}
		});
	});
});
