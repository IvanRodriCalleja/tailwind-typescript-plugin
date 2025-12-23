import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('[JSX] array-binary', () => {
	describe('error-09-binary-with-arbitrary-and-invalid', () => {
		it(`❌ Invalid: Binary with mix of arbitrary and invalid in array`, async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-size');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('h-[50vh');

				// Verify position points to the invalid class
				const diagnostic = invalidDiagnostics[0];
				const { line, column } = getLineAndColumn(diagnostic.start!, sourceCode);
				expect(line).toBe(13);
				expect(column).toBe(53);
			} finally {
				plugin.dispose();
			}
		});
	});
});
