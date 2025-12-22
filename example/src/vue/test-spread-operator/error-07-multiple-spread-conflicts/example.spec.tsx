import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] test-spread-operator', () => {
	describe('error-07-multiple-spread-conflicts', () => {
		it('⚠️ error 07 multiple spread conflicts', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, generatedCode);

				expect(conflictClasses).toContain('text-sm');
				expect(conflictClasses).toContain('text-lg');
				expect(conflictClasses).toContain('font-medium');
				expect(conflictClasses).toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
