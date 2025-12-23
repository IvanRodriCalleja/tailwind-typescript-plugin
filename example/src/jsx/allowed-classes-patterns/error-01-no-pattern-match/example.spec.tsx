import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('[JSX] allowed-classes-patterns', () => {
	describe('error-01-no-pattern-match', () => {
		it("❌ Invalid: Class doesn't match any pattern", async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClassNames).toContain('unknown-class');

				// Verify position points to the invalid class
				const diagnostic = invalidDiagnostics[0];
				const { line, column } = getLineAndColumn(diagnostic.start!, sourceCode);
				expect(line).toBe(6);
				expect(column).toBe(25);

				const text = sourceCode.substring(diagnostic.start!, diagnostic.start! + diagnostic.length!);
				expect(text).toBe('unknown-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
