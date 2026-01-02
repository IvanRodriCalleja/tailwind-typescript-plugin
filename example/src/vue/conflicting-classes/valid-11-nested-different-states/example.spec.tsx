import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] conflicting-classes', () => {
	describe('valid-11-nested-different-states', () => {
		it('should not report conflicts for nested prefixes with different states', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

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
