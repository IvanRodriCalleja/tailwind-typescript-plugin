import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] array-ternary', () => {
	describe('error-04-multiple-classes-one-invalid', () => {
		it(`❌ Invalid: Ternary with multiple classes, one invalid`, async () => {
			const { diagnostics, sourceCode, generatedCode, plugin, mappings } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-blue-500');
				expect(invalidClassNames).not.toContain('font-bold');
				expect(invalidClassNames).not.toContain('bg-gray-500');

				// Verify position points to the invalid class in Vue source
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(12);
				expect(column).toBe(52);
			} finally {
				plugin.dispose();
			}
		});
	});
});
