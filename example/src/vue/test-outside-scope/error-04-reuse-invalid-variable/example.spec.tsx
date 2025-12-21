import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('test-outside-scope', () => {
	describe('error-04-reuse-invalid-variable', () => {
		it('❌ should report invalid-outside-class in reused variable', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-outside-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
