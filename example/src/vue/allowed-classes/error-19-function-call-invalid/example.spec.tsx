import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-19-function-call-invalid', () => {
		/**
		 * KNOWN LIMITATION: Classes returned by functions cannot be validated at template level.
		 * Vue generates `class: (__VLS_ctx.getClasses())` - we see the function call,
		 * but not the actual return value at compile time.
		 */
		it('cannot detect invalid class in function return (known limitation)', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				// Known limitation: function returns in template don't expose class values
				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
