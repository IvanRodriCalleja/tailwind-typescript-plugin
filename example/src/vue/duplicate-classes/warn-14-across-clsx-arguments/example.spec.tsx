import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('duplicate-classes', () => {
	describe('warn-14-across-clsx-arguments', () => {
		it('⚠️ Warning: Duplicate across clsx arguments', async () => {
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
