/**
 * ❌ Invalid: Same invalid variable used multiple times - errors at declaration
 * @invalidClasses [invalid-reused]
 */
export function ReusedVariableInvalidFirst() {
	const reusedInvalidClasses = 'invalid-reused';
	return <div className={reusedInvalidClasses}>Reused invalid - first</div>;
}
