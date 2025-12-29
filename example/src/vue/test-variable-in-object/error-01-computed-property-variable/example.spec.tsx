import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] test-variable-in-object', () => {
	describe('error-01-computed-property-variable', () => {
		it('should detect invalid class in computed property variable', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);

				// Should detect the invalid class
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				// Extract class names from diagnostic messages
				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-object-var');

				// Verify the diagnostic position maps to the script section
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				// The diagnostic points directly to 'invalid-object-var' in the script
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(2);
				expect(column).toBe(23);

				// Verify the text at the Vue position is 'invalid-object-var' (the actual invalid class)
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-object-var');
			} finally {
				plugin.dispose();
			}
		});
	});
});
