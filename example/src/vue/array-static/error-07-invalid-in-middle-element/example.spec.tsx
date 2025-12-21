import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('array-static', () => {
	describe('error-07-invalid-in-middle-element', () => {
		it(`❌ Invalid: Invalid in middle element`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-middle');
				expect(invalidClassNames).not.toContain('flex');
				expect(invalidClassNames).not.toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
