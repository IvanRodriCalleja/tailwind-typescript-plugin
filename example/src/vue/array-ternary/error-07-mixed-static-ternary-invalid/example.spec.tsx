import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] array-ternary', () => {
	describe('error-07-mixed-static-ternary-invalid', () => {
		it(`❌ Invalid: Mix with invalid in both static and ternary`, async () => {
			const { diagnostics, sourceCode, generatedCode, plugin, mappings } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-static');
				expect(invalidClassNames).toContain('invalid-ternary');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('bg-gray-500');

				// Verify position points to the invalid class in Vue source
				const diagnostic = invalidDiagnostics[0];
				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();
				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(15);
				expect(column).toBe(8);
			} finally {
				plugin.dispose();
			}
		});
	});
});
