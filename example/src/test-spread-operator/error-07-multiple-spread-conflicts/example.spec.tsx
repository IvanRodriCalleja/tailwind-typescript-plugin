import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-spread-operator', () => {
	describe('error-07-multiple-spread-conflicts', () => {
		it('⚠️ error 07 multiple spread conflicts', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

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
