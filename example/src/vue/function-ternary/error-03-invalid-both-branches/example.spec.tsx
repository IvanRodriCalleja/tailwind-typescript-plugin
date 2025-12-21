import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('function-ternary', () => {
	describe('error-03-invalid-both-branches', () => {
		it('❌ Invalid: Function with ternary expression, invalid in both branches', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-inactive');
			} finally {
				plugin.dispose();
			}
		});
	});
});
