import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] tv-class-override', () => {
	describe('error-01-class-override-invalid', () => {
		it('❌ error 01 class override invalid', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClasses).toContain('invalid-override-class');

				expect(invalidClasses).not.toContain('bg-pink-500');
				expect(invalidClasses).not.toContain('hover:bg-pink-700');

				// Verify line/column position for 'invalid-override-class'
				const diagnostic = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-override-class')
				);
				expect(diagnostic).toBeDefined();

				const mappedPosition = mapGeneratedToVuePosition(diagnostic!.start!, mappings);
				expect(mappedPosition).not.toBeNull();

				const { line, column } = getLineAndColumn(mappedPosition!.vuePosition, sourceCode);
				expect(line).toBe(24);
				expect(column).toBe(27);
			} finally {
				plugin.dispose();
			}
		});
	});
});
