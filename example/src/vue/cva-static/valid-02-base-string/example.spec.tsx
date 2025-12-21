import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] cva-static', () => {
	describe('valid-02-base-string', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('border');
				expect(invalidClasses).not.toContain('rounded');
			} finally {
				plugin.dispose();
			}
		});
	});
});
