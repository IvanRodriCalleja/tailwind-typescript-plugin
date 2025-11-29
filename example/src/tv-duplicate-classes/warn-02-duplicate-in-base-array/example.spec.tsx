import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('warn-02-duplicate-in-base-array', () => {
		it('⚠️ warn 02 duplicate in base array', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
