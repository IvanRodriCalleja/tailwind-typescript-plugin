import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-12-across-array-elements', () => {
		it('⚠️ Warning: Duplicate across array elements', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('bg-blue-500');
				expect(duplicateClasses).toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
