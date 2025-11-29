import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('warn-09-duplicate-across-compound-variants', () => {
		it('⚠️ should detect duplicate classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('font-bold');
				expect(duplicateClasses).toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
