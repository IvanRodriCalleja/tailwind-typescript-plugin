import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('[JSX] allowed-classes-patterns', () => {
	describe('error-05-mixed-valid-invalid', () => {
		it(`❌ Invalid: Mix of valid patterns and invalid class`, async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClassNames).toContain('not-allowed');
				expect(invalidClassNames).not.toContain('custom-header');
				expect(invalidClassNames).not.toContain('close-icon');

				// Verify position points to the invalid class
				const diagnostic = invalidDiagnostics[0];
				const { line, column } = getLineAndColumn(diagnostic.start!, sourceCode);
				expect(line).toBe(7);
				expect(column).toBe(50);

				const text = sourceCode.substring(diagnostic.start!, diagnostic.start! + diagnostic.length!);
				expect(text).toBe('not-allowed');
			} finally {
				plugin.dispose();
			}
		});
	});
});
