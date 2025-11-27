function buildStyles(config: { className?: string }) {
	return config.className || '';
}

/**
 * ✅ Valid: Another utility function should NOT be validated
 * @validClasses []
 */
export function UtilityFunctionNotValidated2() {
	return (
		<div className={buildStyles({ className: 'also-not-validated another-invalid' })}>
			Utility Function 2 (should not validate)
		</div>
	);
}
