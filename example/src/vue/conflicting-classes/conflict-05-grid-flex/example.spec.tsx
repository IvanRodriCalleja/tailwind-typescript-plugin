import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] conflicting-classes', () => {
	describe('conflict-05-grid-flex', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('grid');
				expect(conflictClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
