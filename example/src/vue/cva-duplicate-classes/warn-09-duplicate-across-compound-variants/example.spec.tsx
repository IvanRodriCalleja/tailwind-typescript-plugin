import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-duplicate-classes', () => {
	describe('warn-09-duplicate-across-compound-variants', () => {
		it('⚠️ should detect duplicate classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('font-bold');
				expect(duplicateClasses).toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
