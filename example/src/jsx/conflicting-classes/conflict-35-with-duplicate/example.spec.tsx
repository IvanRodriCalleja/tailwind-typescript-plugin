import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-35-with-duplicate', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');

				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('flex');
				expect(conflictClasses).toContain('flex');
				expect(conflictClasses).toContain('block');
			} finally {
				plugin.dispose();
			}
		});
	});
});
