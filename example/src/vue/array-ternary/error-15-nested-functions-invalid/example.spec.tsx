import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('array-ternary', () => {
	describe('error-15-nested-functions-invalid', () => {
		it(`❌ Invalid: Nested functions with invalid ternary in array`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-active');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-gray-500');
				expect(invalidClassNames).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
