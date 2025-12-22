import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-variable', () => {
	describe('error-04-invalid-both-sides', () => {
		it('❌ Invalid: Template literal with interpolation, invalid classes on both sides', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-before');
				expect(invalidClassNames).toContain('invalid-after');
			} finally {
				plugin.dispose();
			}
		});
	});
});
