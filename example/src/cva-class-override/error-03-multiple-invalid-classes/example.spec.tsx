import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-class-override', () => {
	describe('error-03-multiple-invalid-classes', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-class-1');
				expect(invalidClasses).toContain('invalid-class-2');

				expect(invalidClasses).not.toContain('bg-pink-500');
				expect(invalidClasses).not.toContain('hover:bg-pink-700');
			} finally {
				plugin.dispose();
			}
		});
	});
});
