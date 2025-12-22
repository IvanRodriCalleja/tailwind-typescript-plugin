import {
	getClassNamesFromDiagnosticMessages,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-04-allowed-in-template-with-invalid', () => {
		it('❌ Invalid: Invalid class in template with allowed classes', async () => {
			const { diagnostics, sourceCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				const invalidClasses = getClassNamesFromDiagnosticMessages(invalidDiagnostics);
				expect(invalidClasses).toContain('invalid-class');
				expect(invalidClasses).not.toContain('custom-button');
				expect(invalidClasses).not.toContain('flex');

				// Verify position points to the invalid class in template
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(8);

				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
