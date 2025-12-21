import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('expression-ternary', () => {
	describe('valid-11-self-closing-ternary-valid', () => {
		it('✅ Valid: Self-closing element with ternary expression', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('rounded-lg');
				expect(invalidClassNames).not.toContain('rounded-sm');
			} finally {
				plugin.dispose();
			}
		});
	});
});
