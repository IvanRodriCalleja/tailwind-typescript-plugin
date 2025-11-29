import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('conflicting-classes', () => {
	describe('valid-01-no-conflicts', () => {
		it('✅ should not report errors', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
				expect(invalidClasses).not.toContain('justify-between');
				expect(invalidClasses).not.toContain('p-4');
				expect(invalidClasses).not.toContain('bg-white');
			} finally {
				plugin.dispose();
			}
		});
	});
});
