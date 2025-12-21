import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-binary', () => {
	describe('error-12-complex-mixed-validity', () => {
		it('❌ Invalid: Multiple conditions with mixed validity', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-disabled');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('text-red-500');
				expect(invalidClassNames).not.toContain('bg-yellow-100');
			} finally {
				plugin.dispose();
			}
		});
	});
});
