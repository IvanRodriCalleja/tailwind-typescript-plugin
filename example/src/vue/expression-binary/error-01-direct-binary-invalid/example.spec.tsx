import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-binary', () => {
	describe('error-01-direct-binary-invalid', () => {
		it('❌ Invalid: Direct binary expression with invalid class', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				console.log('All diagnostics:', diagnostics);
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				console.log('Invalid diagnostics:', invalidDiagnostics);
				const invalidClassNames = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				console.log('Invalid class names:', invalidClassNames);

				expect(invalidClassNames).toContain('invalid-error');

				// Verify line/column position
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(9);
				expect(column).toBe(28);

				// Verify the text at the Vue position points to the class string
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-error');
			} finally {
				plugin.dispose();
			}
		});
	});
});
