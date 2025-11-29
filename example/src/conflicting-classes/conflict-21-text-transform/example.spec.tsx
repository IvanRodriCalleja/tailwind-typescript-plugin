import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-21-text-transform', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('uppercase');
				expect(conflictClasses).toContain('lowercase');
			} finally {
				plugin.dispose();
			}
		});
	});
});
