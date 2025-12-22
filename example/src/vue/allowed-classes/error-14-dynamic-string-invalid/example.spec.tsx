import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-14-dynamic-string-invalid', () => {
		it('should detect invalid class in script variable and report at script position', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);

				// Should detect the invalid class
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				// Extract class names from diagnostic messages
				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-dynamic');

				// Verify the diagnostic position maps to the script section
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				// The diagnostic points directly to 'invalid-dynamic' in the script (line 5)
				const { line } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(5);

				// Verify the text at the Vue position is 'invalid-dynamic' (the actual invalid class)
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-dynamic');
			} finally {
				plugin.dispose();
			}
		});
	});
});
