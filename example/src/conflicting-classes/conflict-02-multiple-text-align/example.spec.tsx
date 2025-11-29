import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-02-multiple-text-align', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('text-left');
				expect(conflictClasses).toContain('text-center');
				expect(conflictClasses).toContain('text-right');
			} finally {
				plugin.dispose();
			}
		});
	});
});
