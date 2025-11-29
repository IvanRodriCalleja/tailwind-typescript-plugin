import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('warn-05-duplicate-in-compound-variant', () => {
		it('⚠️ warn 05 duplicate in compound variant', async () => {
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
