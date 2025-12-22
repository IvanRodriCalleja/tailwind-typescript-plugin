import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-ternary', () => {
	describe('error-13-card-with-conditionals', () => {
		it('❌ Invalid: Card component with various conditionals and invalid classes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-shadow');
				expect(invalidClassNames).toContain('invalid-border');
				expect(invalidClassNames).not.toContain('p-6');
				expect(invalidClassNames).not.toContain('rounded-lg');
				expect(invalidClassNames).not.toContain('bg-white');
				expect(invalidClassNames).not.toContain('dark:bg-gray-800');
				expect(invalidClassNames).not.toContain('shadow-lg');
				expect(invalidClassNames).not.toContain('border');
				expect(invalidClassNames).not.toContain('border-gray-200');
				expect(invalidClassNames).not.toContain('dark:border-gray-700');
				expect(invalidClassNames).not.toContain('border-red-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
