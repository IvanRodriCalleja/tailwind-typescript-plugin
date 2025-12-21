import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('array-ternary', () => {
	describe('error-04-multiple-classes-one-invalid', () => {
		it(`❌ Invalid: Ternary with multiple classes, one invalid`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-blue-500');
				expect(invalidClassNames).not.toContain('font-bold');
				expect(invalidClassNames).not.toContain('bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
