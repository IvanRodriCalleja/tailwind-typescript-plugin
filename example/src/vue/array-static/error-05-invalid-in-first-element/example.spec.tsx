import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('array-static', () => {
	describe('error-05-invalid-in-first-element', () => {
		it(`❌ Invalid: Invalid in first element`, async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClassNames = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				expect(invalidClassNames).toContain('invalid-first');
				expect(invalidClassNames).not.toContain('items-center');
				expect(invalidClassNames).not.toContain('justify-center');
			} finally {
				plugin.dispose();
			}
		});
	});
});
