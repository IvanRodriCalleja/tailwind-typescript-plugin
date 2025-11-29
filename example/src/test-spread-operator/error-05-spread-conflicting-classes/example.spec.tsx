import {
	getClassNamesFromDiagnostics,
	getConflictClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-spread-operator', () => {
	describe('error-05-spread-conflicting-classes', () => {
		it('⚠️ error 05 spread conflicting classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const conflictDiagnostics = getConflictClassDiagnostics(diagnostics);
				const conflictClasses = getClassNamesFromDiagnostics(conflictDiagnostics, sourceCode);

				expect(conflictClasses).toContain('p-4');
				expect(conflictClasses).toContain('p-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
