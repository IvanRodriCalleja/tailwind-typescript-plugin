import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-static', () => {
	describe('valid-09-mixed', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('border');
				expect(invalidClasses).not.toContain('bg-blue-500');
				expect(invalidClasses).not.toContain('text-white');
				expect(invalidClasses).not.toContain('text-sm');
				expect(invalidClasses).not.toContain('py-1');
			} finally {
				plugin.dispose();
			}
		});
	});
});
