import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-14-dynamic-string-invalid', () => {
		/**
		 * KNOWN LIMITATION: Classes in script variables cannot be validated at template level.
		 * Vue generates `class: (__VLS_ctx.myClass)` - only the variable reference is visible,
		 * not the actual string value at compile time.
		 */
		it('cannot detect invalid class in script variable (known limitation)', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				// Known limitation: variable references in template don't expose class values
				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
