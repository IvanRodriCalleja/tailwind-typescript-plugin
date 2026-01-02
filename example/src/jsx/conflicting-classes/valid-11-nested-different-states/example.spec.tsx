import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('valid-11-nested-different-states', () => {
		it('should not report conflicts for nested prefixes with different states', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				// sm:hover: and sm:focus: are different prefixes, no conflict
				expect(conflictClasses).not.toContain('sm:hover:text-left');
				expect(conflictClasses).not.toContain('sm:focus:text-center');
				expect(conflictDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
