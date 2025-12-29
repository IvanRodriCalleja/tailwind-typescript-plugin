import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] utility-function-imports', () => {
	describe('error-03-simple-string-invalid', () => {
		it('❌ error 03 simple string invalid', async () => {
			const { diagnostics, generatedCode, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('bad-class');

				expect(invalidClasses).not.toContain('flex');

				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(9);
				expect(column).toBe(34);
			} finally {
				plugin.dispose();
			}
		});
	});
});
