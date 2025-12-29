import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-class-override', () => {
	describe('error-04-all-invalid-classes', () => {
		it('❌ error 04 all invalid classes', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('completely-invalid');
				expect(invalidClasses).toContain('another-invalid-class');

				// Verify line/column position for 'completely-invalid'
				const diagnostic1 = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('completely-invalid')
				);
				expect(diagnostic1).toBeDefined();

				const mappedPosition1 = mapGeneratedToVuePosition(diagnostic1!.start!, mappings);
				expect(mappedPosition1).not.toBeNull();

				const { line: line1, column: column1 } = getLineAndColumn(mappedPosition1!.vuePosition, sourceCode);
				expect(line1).toBe(23);
				expect(column1).toBe(15);

				// Verify line/column position for 'another-invalid-class'
				const diagnostic2 = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('another-invalid-class')
				);
				expect(diagnostic2).toBeDefined();

				const mappedPosition2 = mapGeneratedToVuePosition(diagnostic2!.start!, mappings);
				expect(mappedPosition2).not.toBeNull();

				const { line: line2, column: column2 } = getLineAndColumn(mappedPosition2!.vuePosition, sourceCode);
				expect(line2).toBe(23);
				expect(column2).toBe(34);
			} finally {
				plugin.dispose();
			}
		});
	});
});
