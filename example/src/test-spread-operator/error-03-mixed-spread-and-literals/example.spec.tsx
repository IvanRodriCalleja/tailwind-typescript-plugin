import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runPlugin
} from '../../../test/folder-test-helpers';

describe('test-spread-operator', () => {
	describe('error-03-mixed-spread-and-literals', () => {
		it('❌ error 03 mixed spread and literals', async () => {
			const { diagnostics, sourceCode, plugin } = await runPlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, sourceCode);

				expect(invalidClasses).toContain('invalid-mixed-class');
				expect(invalidClasses).toContain('another-invalid');
			} finally {
				plugin.dispose();
			}
		});
	});
});
