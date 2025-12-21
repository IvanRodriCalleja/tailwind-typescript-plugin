import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] cva-class-override', () => {
	describe('error-06-multiple-variants-with-invalid-override', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-multi-variant');

				expect(invalidClasses).not.toContain('bg-indigo-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
