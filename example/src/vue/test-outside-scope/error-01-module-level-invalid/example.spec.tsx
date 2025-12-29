import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] test-outside-scope', () => {
	describe('error-01-module-level-invalid', () => {
		it('❌ should report invalid-outside-class in module-level variable', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } =
				await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-outside-class');

				// Verify line/column position
				const diagnostic = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-outside-class')
				);
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(2);
				expect(column).toBe(30);

				// Verify the text at the Vue position
				const vueText = sourceCode.substring(
					mappedPosition!.vuePosition,
					mappedPosition!.vuePosition + diagnostic!.length!
				);
				expect(vueText).toBe('invalid-outside-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
