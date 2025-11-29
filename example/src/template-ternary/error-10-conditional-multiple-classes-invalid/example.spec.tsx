import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('template-ternary', () => {
	describe('error-10-conditional-multiple-classes-invalid', () => {
		it('❌ Invalid: Conditional branches with multiple classes, some invalid', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).toContain('invalid-bg');
				expect(invalidClassNames).toContain('invalid-text');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('text-white');
				expect(invalidClassNames).not.toContain('font-bold');
				expect(invalidClassNames).not.toContain('text-black');
			} finally {
				plugin.dispose();
			}
		});
	});
});
