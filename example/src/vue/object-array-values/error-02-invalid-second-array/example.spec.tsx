import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('object-array-values', () => {
	describe('error-02-invalid-second-array', () => {
		it('❌ Invalid: Multiple properties with array values, invalid in second', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-text');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-center');
				expect(invalidClassNames).not.toContain('bg-blue-500');
			} finally {
				plugin.dispose();
			}
		});
	});
});
