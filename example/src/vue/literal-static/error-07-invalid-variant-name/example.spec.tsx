import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('literal-static', () => {
	describe('error-07-invalid-variant-name', () => {
		it('❌ should report invalidvariant:bg-blue-500 as invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalidvariant:bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
