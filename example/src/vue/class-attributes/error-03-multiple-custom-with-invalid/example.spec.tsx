import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] jsx/class-attributes', () => {
	describe('error-03-multiple-custom-with-invalid', () => {
		it('should detect invalid classes across multiple custom attributes', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(2);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(classNames).toContain('bad-color');
				expect(classNames).toContain('bad-text');
			} finally {
				plugin.dispose();
			}
		});
	});
});
