import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] mixed-complex', () => {
	describe('error-01-kitchen-sink-invalid', () => {
		it('❌ Invalid: Kitchen sink with invalid class', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } =
				await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(invalidClasses).toContain('invalid-class');

				// Verify line/column position
				const diagnostic = invalidDiagnostics.find(d => {
					const text = generatedCode.substring(d.start!, d.start! + d.length!);
					return text === 'invalid-class';
				});
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(13);
				expect(column).toBe(57);

				// Verify the text at the Vue position
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
