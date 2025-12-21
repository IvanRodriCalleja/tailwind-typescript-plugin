import {
	getClassNamesFromDiagnostics,
	getDuplicateClassDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] duplicate-classes', () => {
	describe('warn-26-with-invalid-class', () => {
		it('❌⚠️ Both invalid class error AND duplicate warning', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const duplicateDiagnostics = getDuplicateClassDiagnostics(diagnostics);
				const duplicateClasses = getClassNamesFromDiagnostics(duplicateDiagnostics, generatedCode);

				expect(duplicateClasses).toContain('flex');
				expect(duplicateClasses).toContain('flex');

				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalidclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
