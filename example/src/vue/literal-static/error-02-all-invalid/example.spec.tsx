import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('literal-static', () => {
	describe('error-02-all-invalid', () => {
		it('❌ Invalid: All classes are invalid', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('badclass');
				expect(invalidClasses).toContain('anotherBad');
				expect(invalidClasses).toContain('wrongClass');
			} finally {
				plugin.dispose();
			}
		});
	});
});
