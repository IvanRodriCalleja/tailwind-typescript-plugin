import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('array-ternary', () => {
	describe('error-09-invalid-variant', () => {
		it(`❌ Invalid: Ternary with invalid variant in array`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-variant:bg-blue');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('hover:bg-gray-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
