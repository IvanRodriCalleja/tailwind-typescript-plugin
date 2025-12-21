import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('template-variable', () => {
	describe('error-03-invalid-after-interpolation', () => {
		it('❌ Invalid: Template literal with interpolation, invalid class after interpolation', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-after');
			} finally {
				plugin.dispose();
			}
		});
	});
});
