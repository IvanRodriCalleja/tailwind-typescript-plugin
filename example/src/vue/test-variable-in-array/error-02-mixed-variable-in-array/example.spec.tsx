import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] test-variable-in-array', () => {
	describe('error-02-mixed-variable-in-array', () => {
		it('should detect invalid class in variable with mixed classes used in array and report at script position', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);

				// Should detect the invalid class
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				// Extract class names from diagnostic messages
				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-mixed-array');

				// Verify the diagnostic position maps to the script section
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				// The diagnostic points directly to 'invalid-mixed-array' in the script (line 2)
				const { line } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(2);

				// Verify the text at the Vue position is 'invalid-mixed-array' (the actual invalid class)
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-mixed-array');
			} finally {
				plugin.dispose();
			}
		});
	});
});
