import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-static', () => {
	describe('error-08-mixed', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-base');
				expect(invalidClasses).toContain('invalid-variant');
				expect(invalidClasses).toContain('invalid-compound');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
