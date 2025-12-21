import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('cva-static', () => {
	describe('error-01-base-array', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-base-class');

				expect(invalidClasses).not.toContain('font-semibold');
				expect(invalidClasses).not.toContain('border');
			} finally {
				plugin.dispose();
			}
		});
	});
});
