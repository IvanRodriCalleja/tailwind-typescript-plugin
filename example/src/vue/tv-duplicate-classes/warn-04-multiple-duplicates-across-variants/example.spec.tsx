import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('tv-duplicate-classes', () => {
	describe('warn-04-multiple-duplicates-across-variants', () => {
		it('⚠️ warn 04 multiple duplicates across variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

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
