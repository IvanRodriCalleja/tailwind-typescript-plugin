import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-ternary', () => {
	describe('error-14-self-closing-invalid-conditional', () => {
		it('❌ Invalid: Self-closing element with invalid class in conditional', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-rounded');
				expect(invalidClassNames).not.toContain('w-full');
				expect(invalidClassNames).not.toContain('h-auto');
				expect(invalidClassNames).not.toContain('rounded-full');
			} finally {
				plugin.dispose();
			}
		});
	});
});
