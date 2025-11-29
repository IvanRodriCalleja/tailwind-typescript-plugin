import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('cva-class-override', () => {
	describe('error-05-complex-invalid-modifier', () => {
		it('❌ should detect invalid classes', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-modifier:bg-red-500');

				expect(invalidClasses).not.toContain('md:bg-purple-600');
			} finally {
				plugin.dispose();
			}
		});
	});
});
