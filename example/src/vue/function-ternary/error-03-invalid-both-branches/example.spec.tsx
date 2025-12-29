import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] function-ternary', () => {
	describe('error-03-invalid-both-branches', () => {
		it('❌ Invalid: Function with ternary expression, invalid in both branches', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBe(2);

				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-active');
				expect(invalidClasses).toContain('invalid-inactive');

				// Verify first error (invalid-active)
				const diagnostic1 = invalidDiagnostics[0];
				const mappedPosition1 = mapGeneratedToVuePosition(diagnostic1!.start!, mappings);
				expect(mappedPosition1).not.toBeNull();

				const { line: line1, column: column1 } = getLineAndColumn(mappedPosition1!.vuePosition, sourceCode);
				expect(line1).toBe(12);
				expect(column1).toBe(41);

				const vueText1 = sourceCode.substring(
					mappedPosition1!.vuePosition,
					mappedPosition1!.vuePosition + diagnostic1!.length!
				);
				expect(vueText1).toBe('invalid-active');

				// Verify second error (invalid-inactive)
				const diagnostic2 = invalidDiagnostics[1];
				const mappedPosition2 = mapGeneratedToVuePosition(diagnostic2!.start!, mappings);
				expect(mappedPosition2).not.toBeNull();

				const { line: line2, column: column2 } = getLineAndColumn(mappedPosition2!.vuePosition, sourceCode);
				expect(line2).toBe(12);
				expect(column2).toBe(60);

				const vueText2 = sourceCode.substring(
					mappedPosition2!.vuePosition,
					mappedPosition2!.vuePosition + diagnostic2!.length!
				);
				expect(vueText2).toBe('invalid-inactive');
			} finally {
				plugin.dispose();
			}
		});
	});
});
