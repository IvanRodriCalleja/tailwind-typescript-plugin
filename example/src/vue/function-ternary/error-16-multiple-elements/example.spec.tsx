import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-ternary', () => {
	describe('error-16-multiple-elements', () => {
		it('❌ should report invalid classes in multiple elements', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
