import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-binary', () => {
	describe('error-02-direct-binary-multiple-classes', () => {
		it('❌ Invalid: Binary expression with multiple classes, one invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');
				expect(invalidClassNames).not.toContain('text-red-500');
				expect(invalidClassNames).not.toContain('font-bold');
			} finally {
				plugin.dispose();
			}
		});
	});
});
