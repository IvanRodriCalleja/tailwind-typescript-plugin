import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-19-function-call-invalid', () => {
		it('should detect invalid class in function return and report at script position', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);

				// Should detect the invalid class
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				// Extract class names from diagnostic messages
				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-function');

				// Verify the diagnostic position maps to the script section
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				// The diagnostic points directly to 'invalid-function' in the script (line 7)
				const { line } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(7);

				// Verify the text at the Vue position is 'invalid-function'
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-function');
			} finally {
				plugin.dispose();
			}
		});
	});
});
