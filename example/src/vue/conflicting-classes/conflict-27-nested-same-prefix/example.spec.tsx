import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] conflicting-classes', () => {
	describe('conflict-27-nested-same-prefix', () => {
		it('should report conflicts for nested prefixes with same prefix', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

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
