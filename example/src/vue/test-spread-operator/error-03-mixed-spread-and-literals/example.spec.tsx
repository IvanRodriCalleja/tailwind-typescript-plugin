import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('test-spread-operator', () => {
	describe('error-03-mixed-spread-and-literals', () => {
		it('❌ error 03 mixed spread and literals', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-mixed-class');
				expect(invalidClasses).toContain('another-invalid');
			} finally {
				plugin.dispose();
			}
		});
	});
});
