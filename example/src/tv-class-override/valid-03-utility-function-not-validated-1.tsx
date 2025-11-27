function myCustomBuilder(config: { class?: string }) {
	return config.class || '';
}

/**
 * ✅ Valid: Utility function with "invalid" classes should NOT be validated
 * @validClasses []
 */
export function UtilityFunctionNotValidated1() {
	return (
		<div className={myCustomBuilder({ class: 'this-is-not-validated invalid-but-ok' })}>
			Utility Function 1 (should not validate)
		</div>
	);
}
