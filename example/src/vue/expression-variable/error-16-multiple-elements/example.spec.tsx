import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-variable', () => {
	describe('error-16-multiple-elements', () => {
		it('❌ Invalid: Multiple elements with different variables', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('bad-class');
				expect(invalidClassNames).toContain('another-bad');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('grid');
				expect(invalidClassNames).not.toContain('flex-col');
			} finally {
				plugin.dispose();
			}
		});
	});
});
