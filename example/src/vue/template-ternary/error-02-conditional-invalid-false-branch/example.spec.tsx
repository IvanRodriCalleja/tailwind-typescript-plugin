import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-ternary', () => {
	describe('error-02-conditional-invalid-false-branch', () => {
		it('❌ Invalid: Conditional with invalid class in false branch', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-inactive');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
