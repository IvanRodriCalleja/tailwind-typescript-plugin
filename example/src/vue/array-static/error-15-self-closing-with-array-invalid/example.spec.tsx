import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] array-static', () => {
	describe('error-15-self-closing-with-array-invalid', () => {
		it(`❌ Invalid: Self-closing element with invalid in array`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');
				expect(invalidClassNames).not.toContain('w-full');
				expect(invalidClassNames).not.toContain('h-auto');
			} finally {
				plugin.dispose();
			}
		});
	});
});
