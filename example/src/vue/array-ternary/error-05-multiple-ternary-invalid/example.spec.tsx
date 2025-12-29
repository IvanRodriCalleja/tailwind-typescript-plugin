import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] array-ternary', () => {
	describe('error-05-multiple-ternary-invalid', () => {
		it(`❌ Invalid: Multiple ternary expressions with invalid classes`, async () => {
			const { diagnostics, sourceCode, generatedCode, plugin, mappings } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-active');
				expect(invalidClassNames).toContain('invalid-disabled');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('bg-gray-500');
				expect(invalidClassNames).not.toContain('text-black');

				// Verify position points to the invalid class in Vue source
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(16);
				expect(column).toBe(19);
			} finally {
				plugin.dispose();
			}
		});
	});
});
