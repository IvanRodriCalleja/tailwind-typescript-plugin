import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-11-tv-base-invalid', () => {
		it('should detect invalid class in tv base', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-tv-base');
				expect(invalidClasses).not.toContain('custom-button');
				expect(invalidClasses).not.toContain('flex');
			} finally {
				plugin.dispose();
			}
		});
	});
});
