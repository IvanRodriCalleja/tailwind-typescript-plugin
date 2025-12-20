import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('warn-05-duplicate-base-and-variant-string', () => {
		it('⚠️ should detect duplicate classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('items-center');
				expect(duplicateClasses).toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
