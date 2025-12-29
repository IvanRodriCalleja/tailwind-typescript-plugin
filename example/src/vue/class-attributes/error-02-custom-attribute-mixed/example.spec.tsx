import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] jsx/class-attributes', () => {
	describe('error-02-custom-attribute-mixed', () => {
		it('should detect multiple invalid classes mixed with valid ones', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin} = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(2);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(classNames).toContain('not-a-class');
				expect(classNames).toContain('also-invalid');

				// Verify position in Vue source for first invalid class
				const diagnostic1 = invalidDiagnostics[0];
				const mappedPosition1 = mapGeneratedToVuePosition(diagnostic1.start!, mappings);
				expect(mappedPosition1).not.toBeNull();

				const { line: line1, column: column1 } = getLineAndColumn(mappedPosition1!.vuePosition, sourceCode);
				expect(line1).toBe(7);
				expect(column1).toBe(27);

				// Verify position in Vue source for second invalid class
				const diagnostic2 = invalidDiagnostics[1];
				const mappedPosition2 = mapGeneratedToVuePosition(diagnostic2.start!, mappings);
				expect(mappedPosition2).not.toBeNull();

				const { line: line2, column: column2 } = getLineAndColumn(mappedPosition2!.vuePosition, sourceCode);
				expect(line2).toBe(7);
				expect(column2).toBe(52);
			} finally {
				plugin.dispose();
			}
		});
	});
});
