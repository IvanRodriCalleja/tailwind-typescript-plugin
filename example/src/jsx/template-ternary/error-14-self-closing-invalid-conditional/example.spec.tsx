import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../../test/folder-test-helpers';

describe('template-ternary', () => {
	describe('error-14-self-closing-invalid-conditional', () => {
		it('❌ Invalid: Self-closing element with invalid class in conditional', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-rounded');
				expect(invalidClassNames).not.toContain('w-full');
				expect(invalidClassNames).not.toContain('h-auto');
				expect(invalidClassNames).not.toContain('rounded-full');
			} finally {
				plugin.dispose();
			}
		});
	});
});
