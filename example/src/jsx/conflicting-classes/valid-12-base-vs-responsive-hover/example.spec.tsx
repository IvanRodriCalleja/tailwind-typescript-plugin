import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('valid-12-base-vs-responsive-hover', () => {
		it('should not report conflicts for base hover vs responsive hover', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				// hover: and md:hover: are different prefixes, no conflict
				expect(conflictClasses).not.toContain('hover:text-left');
				expect(conflictClasses).not.toContain('md:hover:text-center');
				expect(conflictDiagnostics).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
