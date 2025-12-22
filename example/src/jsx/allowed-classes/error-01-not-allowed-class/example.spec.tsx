import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('[JSX] allowed-classes', () => {
	describe('error-01-not-allowed-class', () => {
		it('❌ Invalid: Custom class NOT in allowed list', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('not-allowed-class');

				// Verify position points to the invalid class
				const diagnostic = invalidDiagnostics[0];
				const { line, column } = getLineAndColumn(diagnostic.start!, sourceCode);
				expect(line).toBe(6);
				expect(column).toBe(25);

				const text = sourceCode.substring(
					diagnostic.start!,
					diagnostic.start! + diagnostic.length!
				);
				expect(text).toBe('not-allowed-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
