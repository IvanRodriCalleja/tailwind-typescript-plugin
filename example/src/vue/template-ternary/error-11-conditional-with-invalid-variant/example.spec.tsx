import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-ternary', () => {
	describe('error-11-conditional-with-invalid-variant', () => {
		it('❌ Invalid: Conditional with invalid variant', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalidvariant:bg-blue-500');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('hover:bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
