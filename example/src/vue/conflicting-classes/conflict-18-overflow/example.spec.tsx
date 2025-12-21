import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('conflicting-classes', () => {
	describe('conflict-18-overflow', () => {
		it('⚠️ should detect conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('overflow-hidden');
				expect(conflictClasses).toContain('overflow-scroll');
			} finally {
				plugin.dispose();
			}
		});
	});
});
