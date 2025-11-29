import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-spread-operator', () => {
	describe('error-06-multiple-spread-duplicates', () => {
		it('⚠️ error 06 multiple spread duplicates', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
