import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] utility-function-imports', () => {
	describe('error-04-namespace-import-invalid', () => {
		it('❌ error 04 namespace import invalid', async () => {
			const { diagnostics, generatedCode, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('not-valid-class');

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');

				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(11);
				expect(column).toBe(52);
			} finally {
				plugin.dispose();
			}
		});
	});
});
