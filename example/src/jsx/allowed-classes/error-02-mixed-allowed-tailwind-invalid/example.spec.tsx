import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	getLineAndColumn,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('[JSX] allowed-classes', () => {
	describe('error-02-mixed-allowed-tailwind-invalid', () => {
		it('❌ Invalid: Mix of allowed, Tailwind, and invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				expect(invalidDiagnostics.length).toBeGreaterThan(0);

				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);
				expect(invalidClasses).toContain('invalid-class');
				expect(invalidClasses).not.toContain('custom-button');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');

				// Verify position points to the invalid class
				const diagnostic = invalidDiagnostics[0];
				const { line, column } = getLineAndColumn(diagnostic.start!, sourceCode);
				expect(line).toBe(8);
				expect(column).toBe(38);

				const text = sourceCode.substring(
					diagnostic.start!,
					diagnostic.start! + diagnostic.length!
				);
				expect(text).toBe('invalid-class');
			} finally {
				plugin.dispose();
			}
		});
	});
});
