import {
	getClassNamesFromDiagnostics,
	getInvalidClassDiagnostics,
	runVuePlugin
} from '../../../../test/vue-test-helpers';

describe('[Vue] allowed-classes', () => {
	describe('error-18-computed-invalid', () => {
		/**
		 * KNOWN LIMITATION: Classes in computed properties cannot be validated at template level.
		 * Vue generates `class: (__VLS_ctx.classes)` - only the computed ref is visible,
		 * not the actual computed value at compile time.
		 */
		it('cannot detect invalid class in computed property (known limitation)', async () => {
			const { diagnostics, generatedCode, plugin } = await runVuePlugin(__dirname);

			try {
				const invalidDiagnostics = getInvalidClassDiagnostics(diagnostics);
				const invalidClasses = getClassNamesFromDiagnostics(invalidDiagnostics, generatedCode);

				// Known limitation: computed refs in template don't expose class values
				expect(invalidClasses).toHaveLength(0);
			} finally {
				plugin.dispose();
			}
		});
	});
});
