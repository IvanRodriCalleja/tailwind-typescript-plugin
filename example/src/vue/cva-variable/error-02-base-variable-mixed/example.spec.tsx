import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] cva-variable', () => {
	describe('error-02-base-variable-mixed', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-cva-mixed-var');

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');

				// Verify line and column position
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(4);
				expect(column).toBe(28);

				// Verify the text at the Vue position is 'invalid-cva-mixed-var'
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-cva-mixed-var');
			} finally {
				plugin.dispose();
			}
		});
	});
});
