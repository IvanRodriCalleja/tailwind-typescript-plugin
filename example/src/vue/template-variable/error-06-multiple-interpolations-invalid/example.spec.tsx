import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-variable', () => {
	describe('error-06-multiple-interpolations-invalid', () => {
		it('❌ Invalid: Multiple interpolations with invalid classes in different positions', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-first');
				expect(invalidClassNames).toContain('invalid-middle');
				expect(invalidClassNames).toContain('invalid-last');
				expect(invalidClassNames).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
