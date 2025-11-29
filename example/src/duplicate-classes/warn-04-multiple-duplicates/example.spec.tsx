import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-04-multiple-duplicates', () => {
		it('⚠️ Warning: Multiple different duplicates', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('items-center');
				expect(duplicateClasses).toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
