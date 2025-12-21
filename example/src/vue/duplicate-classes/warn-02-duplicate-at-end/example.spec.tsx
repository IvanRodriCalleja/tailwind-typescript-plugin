import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-02-duplicate-at-end', () => {
		it('⚠️ Warning: Duplicate at the end', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('p-4');
				expect(duplicateClasses).toContain('p-4');
			} finally {
				plugin.dispose();
			}
		});
	});
});
