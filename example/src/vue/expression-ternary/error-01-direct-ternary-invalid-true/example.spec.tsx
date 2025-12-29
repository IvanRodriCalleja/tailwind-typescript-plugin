import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-ternary', () => {
	describe('error-01-direct-ternary-invalid-true', () => {
		it('❌ Invalid: Direct ternary with invalid in true branch', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);

				// Should detect the invalid class
				expect(invalidDiagnostics.length).toBe(1);

				// Extract class names from diagnostic messages
				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-active');

				// Verify line/column position
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(10);
				expect(column).toBe(28);

				// Verify the text at the Vue position is 'invalid-active'
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic.length!
				);
				expect(vueText).toBe('invalid-active');
			} finally {
				plugin.dispose();
			}
		});
	});
});
