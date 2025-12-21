import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-12-tv-variants-invalid', () => {
		it('should detect invalid class in tv variants', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-tv-variant');
				expect(invalidClasses).not.toContain('custom-button');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('app-header');
			} finally {
				plugin.dispose();
			}
		});
	});
});
