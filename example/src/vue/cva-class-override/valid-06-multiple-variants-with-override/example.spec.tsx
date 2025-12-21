import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] cva-class-override', () => {
	describe('valid-06-multiple-variants-with-override', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('bg-indigo-500');
				expect(invalidClasses).not.toContain('hover:bg-indigo-700');
			} finally {
				plugin.dispose();
			}
		});
	});
});
