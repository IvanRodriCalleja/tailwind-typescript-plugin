import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-03-duplicate-in-middle', () => {
		it('⚠️ Warning: Duplicate in the middle', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('bg-white');
				expect(duplicateClasses).toContain('bg-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
