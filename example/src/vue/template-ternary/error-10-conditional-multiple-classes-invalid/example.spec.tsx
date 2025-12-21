import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-ternary', () => {
	describe('error-10-conditional-multiple-classes-invalid', () => {
		it('❌ Invalid: Conditional branches with multiple classes, some invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-bg');
				expect(invalidClassNames).toContain('invalid-text');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('text-white');
				expect(invalidClassNames).not.toContain('font-bold');
				expect(invalidClassNames).not.toContain('text-black');
			} finally {
				plugin.dispose();
			}
		});
	});
});
