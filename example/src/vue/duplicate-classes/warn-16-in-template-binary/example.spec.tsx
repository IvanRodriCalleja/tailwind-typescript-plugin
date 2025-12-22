import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] duplicate-classes', () => {
	describe('warn-16-in-template-binary', () => {
		it('⚠️ Warning: Duplicate in template binary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('border');
				expect(duplicateClasses).toContain('border');
			} finally {
				plugin.dispose();
			}
		});
	});
});
