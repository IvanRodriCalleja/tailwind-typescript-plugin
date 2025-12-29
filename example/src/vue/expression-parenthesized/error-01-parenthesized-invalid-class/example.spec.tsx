import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] expression-parenthesized', () => {
	describe('error-01-parenthesized-invalid-class', () => {
		it('❌ Invalid: Parenthesized invalid class', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-class');

				// Verify position mapping
				const diagnostic = invalidDiagnostics[0];
				expect(diagnostic).toBeDefined();
				expect(diagnostic.start).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(7);
				expect(column).toBe(15);
			} finally {
				plugin.dispose();
			}
		});
	});
});
