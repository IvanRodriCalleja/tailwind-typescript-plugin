import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('warn-06-duplicate-in-compound-variant-classname', () => {
		it('⚠️ warn 06 duplicate in compound variant classname', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('p-4');
				expect(duplicateClasses).toContain('p-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
