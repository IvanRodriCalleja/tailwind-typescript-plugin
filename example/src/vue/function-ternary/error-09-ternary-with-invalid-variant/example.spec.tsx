import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] function-ternary', () => {
	describe('error-09-ternary-with-invalid-variant', () => {
		it('❌ should report invalid-variant:bg-blue in ternary', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-variant:bg-blue');
			} finally {
				plugin.dispose();
			}
		});
	});
});
