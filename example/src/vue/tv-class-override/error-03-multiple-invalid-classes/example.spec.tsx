import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-class-override', () => {
	describe('error-03-multiple-invalid-classes', () => {
		it('❌ error 03 multiple invalid classes', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-class-1');
				expect(invalidClasses).toContain('invalid-class-2');

				expect(invalidClasses).not.toContain('bg-pink-500');
				expect(invalidClasses).not.toContain('hover:bg-pink-700');

				// Verify line/column position for 'invalid-class-1'
				const diagnostic1 = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-class-1')
				);
				expect(diagnostic1).toBeDefined();

				const mappedPosition1 = mapGeneratedToVuePosition(diagnostic1!.start!, mappings);
				expect(mappedPosition1).not.toBeNull();

				const { line: line1, column: column1 } = getLineAndColumn(mappedPosition1!.vuePosition, sourceCode);
				expect(line1).toBe(24);
				expect(column1).toBe(15);

				// Verify line/column position for 'invalid-class-2'
				const diagnostic2 = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-class-2')
				);
				expect(diagnostic2).toBeDefined();

				const mappedPosition2 = mapGeneratedToVuePosition(diagnostic2!.start!, mappings);
				expect(mappedPosition2).not.toBeNull();

				const { line: line2, column: column2 } = getLineAndColumn(mappedPosition2!.vuePosition, sourceCode);
				expect(line2).toBe(24);
				expect(column2).toBe(43);
			} finally {
				plugin.dispose();
			}
		});
	});
});
