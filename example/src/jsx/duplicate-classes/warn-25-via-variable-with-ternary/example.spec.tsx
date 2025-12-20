import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-25-via-variable-with-ternary', () => {
		it("⚠️ Warning: Variable contains ternary - root 'flex' + variable's 'flex' = duplicate", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, sourceCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
