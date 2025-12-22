import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] cva-duplicate-classes', () => {
	describe('valid-04-boolean-variants-with-null', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('opacity-50');
				expect(invalidClasses).not.toContain('cursor-not-allowed');
			} finally {
				plugin.dispose();
			}
		});
	});
});
