import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('utility-function-imports', () => {
	describe('error-01-invalid-class-with-correct-import', () => {
		it('❌ error 01 invalid class with correct import', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-tailwind-class');

				expect(invalidClasses).not.toContain('flex');
				expect(invalidClasses).not.toContain('items-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
