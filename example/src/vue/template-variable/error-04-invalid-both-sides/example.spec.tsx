import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	mapGeneratedToVuePosition,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] template-variable', () => {
	describe('error-04-invalid-both-sides', () => {
		it('❌ Invalid: Template literal with interpolation, invalid classes on both sides', async () => {
			const { diagnostics, sourceCode, generatedCode, mappings, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-before');
				expect(invalidClassNames).toContain('invalid-after');

				// Verify position of 'invalid-before' diagnostic
				const diagnosticBefore = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-before')
				);
				expect(diagnosticBefore).toBeDefined();

				const mappedPositionBefore = mapGeneratedToVuePosition(diagnosticBefore!.start!, mappings);
				expect(mappedPositionBefore).not.toBeNull();

				const { line: lineBefore, column: columnBefore } = getLineAndColumn(mappedPositionBefore!.vuePosition, sourceCode);
				expect(lineBefore).toBe(9);
				expect(columnBefore).toBe(17);

				// Verify position of 'invalid-after' diagnostic
				const diagnosticAfter = invalidDiagnostics.find(d =>
					getClassNamesFromDiagnostics([d], generatedCode).includes('invalid-after')
				);
				expect(diagnosticAfter).toBeDefined();

				const mappedPositionAfter = mapGeneratedToVuePosition(diagnosticAfter!.start!, mappings);
				expect(mappedPositionAfter).not.toBeNull();

				const { line: lineAfter, column: columnAfter } = getLineAndColumn(mappedPositionAfter!.vuePosition, sourceCode);
				expect(lineAfter).toBe(9);
				expect(columnAfter).toBe(48);
			} finally {
				plugin.dispose();
			}
		});
	});
});
