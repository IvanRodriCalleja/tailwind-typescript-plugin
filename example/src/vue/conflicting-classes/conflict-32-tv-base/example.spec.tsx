import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] conflicting-classes', () => {
	describe('conflict-32-tv-base', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('flex');
				expect(conflictClasses).toContain('block');
			} finally {
				plugin.dispose();
			}
		});
	});
});
