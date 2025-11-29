import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-19-overflow-auto-visible', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('overflow-auto');
				expect(conflictClasses).toContain('overflow-visible');
			} finally {
				plugin.dispose();
			}
		});
	});
});
