import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('expression-static', () => {
	describe('valid-06-state-variants', () => {
		it('✅ Valid: Classes with variants (hover, focus, etc.)', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('hover:bg-blue-500');
				expect(invalidClassNames).not.toContain('focus:ring-2');
				expect(invalidClassNames).not.toContain('active:scale-95');
			} finally {
				plugin.dispose();
			}
		});
	});
});
