import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-25-cursor', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('cursor-pointer');
				expect(conflictClasses).toContain('cursor-not-allowed');
			} finally {
				plugin.dispose();
			}
		});
	});
});
