import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-08-clsx-nested-invalid', () => {
		it('should detect invalid class in nested clsx arrays', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('deeply-nested-invalid');
				expect(invalidClasses).not.toContain('custom-button');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('app-header');
			} finally {
				plugin.dispose();
			}
		});
	});
});
