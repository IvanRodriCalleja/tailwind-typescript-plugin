import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] test-spread-operator', () => {
	describe('error-05-spread-conflicting-classes', () => {
		it('⚠️ error 05 spread conflicting classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('p-4');
				expect(conflictClasses).toContain('p-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
