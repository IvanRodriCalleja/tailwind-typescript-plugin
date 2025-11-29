import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-12-across-array-elements', () => {
		it('⚠️ Warning: Duplicate across array elements', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('bg-blue-500');
				expect(duplicateClasses).toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
