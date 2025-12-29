import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] jsx/class-attributes', () => {
	describe('error-04-custom-with-clsx-invalid', () => {
		it('should detect invalid class in custom attribute with clsx', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics).toHaveLength(1);

				const classNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);
				expect(classNames).toContain('invalid-class');

				// Verify position in Vue source
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(11);
				expect(column).toBe(56);
			} finally {
				plugin.dispose();
			}
		});
	});
});
