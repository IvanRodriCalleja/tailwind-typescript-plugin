import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] literal-static', () => {
	describe('error-09-multiple-elements', () => {
		it('❌ should report invalid classes in multiple elements', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('validclass');
				expect(invalidClasses).toContain('badclass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
