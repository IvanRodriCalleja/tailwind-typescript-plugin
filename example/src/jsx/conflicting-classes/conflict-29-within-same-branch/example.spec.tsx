import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-29-within-same-branch', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('text-left');
				expect(conflictClasses).toContain('text-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
