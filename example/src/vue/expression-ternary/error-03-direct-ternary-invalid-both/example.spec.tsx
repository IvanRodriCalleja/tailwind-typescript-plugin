import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-ternary', () => {
	describe('error-03-direct-ternary-invalid-both', () => {
		it('❌ Invalid: Direct ternary with invalid in both branches', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-active');
				expect(invalidClassNames).toContain('invalid-inactive');
			} finally {
				plugin.dispose();
			}
		});
	});
});
