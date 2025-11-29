import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-outside-scope', () => {
	describe('error-02-module-level-mixed', () => {
		it('❌ should report invalid-mixed-outside but not valid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-mixed-outside');
				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
