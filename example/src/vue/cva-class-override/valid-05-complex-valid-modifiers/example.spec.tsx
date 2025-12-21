import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-class-override', () => {
	describe('valid-05-complex-valid-modifiers', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('md:bg-purple-600');
				expect(invalidClasses).not.toContain('lg:hover:bg-purple-800');
				expect(invalidClasses).not.toContain('dark:bg-purple-900');
			} finally {
				plugin.dispose();
			}
		});
	});
});
