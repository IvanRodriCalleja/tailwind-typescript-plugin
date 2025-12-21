import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] object-array-values', () => {
	describe('error-11-invalid-first-object', () => {
		it('❌ Invalid: Multiple objects with array values, invalid in first', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-items');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('justify-center');
				expect(invalidClassNames).not.toContain('bg-blue-500');
				expect(invalidClassNames).not.toContain('text-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
