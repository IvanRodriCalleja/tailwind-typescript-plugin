import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-13-justify-content', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('justify-start');
				expect(conflictClasses).toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
