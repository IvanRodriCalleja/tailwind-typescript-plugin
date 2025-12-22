import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] mixed-complex', () => {
	describe('error-11-nested-functions-complex-invalid', () => {
		it('❌ should report invalid-nested-fn in nested function calls', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-nested-fn');
			} finally {
				plugin.dispose();
			}
		});
	});
});
