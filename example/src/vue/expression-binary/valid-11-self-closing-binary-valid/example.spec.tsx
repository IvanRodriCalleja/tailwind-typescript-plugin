import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-binary', () => {
	describe('valid-11-self-closing-binary-valid', () => {
		it('✅ Valid: Self-closing element with binary expression', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).not.toContain('rounded-lg');
				expect(invalidClassNames).not.toContain('shadow-md');
			} finally {
				plugin.dispose();
			}
		});
	});
});
