import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-variable', () => {
	describe('error-02-invalid-before-interpolation', () => {
		it('❌ Invalid: Template literal with interpolation, invalid class before interpolation', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-before');

				// Verify position of 'invalid-before' diagnostic
				const diagnostic = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-before')
				);
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(9);
				expect(column).toBe(17);
			} finally {
				plugin.dispose();
			}
		});
	});
});
