import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-27-nested-same-prefix', () => {
		it('should report conflicts for nested prefixes with same prefix', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				// sm:hover:text-left and sm:hover:text-center have the same prefix
				expect(conflictClasses).toContain('sm:hover:text-left');
				expect(conflictClasses).toContain('sm:hover:text-center');
				expect(conflictDiagnostics).toHaveLength(2);
			} finally {
				plugin.dispose();
			}
		});
	});
});
