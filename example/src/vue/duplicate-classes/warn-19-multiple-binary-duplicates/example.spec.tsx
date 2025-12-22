import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] duplicate-classes', () => {
	describe('warn-19-multiple-binary-duplicates', () => {
		it('⚠️ Warning: Multiple binary duplicates', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('p-4');
				expect(duplicateClasses).toContain('p-4');
				expect(duplicateClasses).toContain('m-2');
				expect(duplicateClasses).toContain('m-2');
			} finally {
				plugin.dispose();
			}
		});
	});
});
