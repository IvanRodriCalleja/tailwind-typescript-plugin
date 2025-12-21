import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] conflicting-classes', () => {
	describe('conflict-35-with-duplicate', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');

				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('flex');
				expect(conflictClasses).toContain('flex');
				expect(conflictClasses).toContain('block');
			} finally {
				plugin.dispose();
			}
		});
	});
});
