import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-class-override', () => {
	describe('valid-02-classname-property-with-valid-classes', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('bg-teal-500');
				expect(invalidClasses).not.toContain('hover:bg-teal-700');
			} finally {
				plugin.dispose();
			}
		});
	});
});
