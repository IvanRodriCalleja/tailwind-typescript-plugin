import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-spread-operator', () => {
	describe('error-04-spread-duplicate-classes', () => {
		it('⚠️ error 04 spread duplicate classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('items-center');
				expect(duplicateClasses).toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
