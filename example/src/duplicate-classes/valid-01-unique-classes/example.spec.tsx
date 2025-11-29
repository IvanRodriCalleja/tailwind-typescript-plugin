import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('duplicate-classes', () => {
	describe('valid-01-unique-classes', () => {
		it('✅ Valid: No duplicates - all unique classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-between');
				expect(invalidClassNames).not.toContain('p-4');
				expect(invalidClassNames).not.toContain('bg-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
