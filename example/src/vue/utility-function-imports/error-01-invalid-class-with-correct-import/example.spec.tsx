import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] utility-function-imports', () => {
	describe('error-01-invalid-class-with-correct-import', () => {
		it('❌ error 01 invalid class with correct import', async () => {
			const { diagnostics, generatedCode, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-tailwind-class');

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');

				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(11);
				expect(column).toBe(49);
			} finally {
				plugin.dispose();
			}
		});
	});
});
