/**
 * ❌ Invalid: Another function with invalid variable
 * @invalidClasses [invalid-reused-2]
 */
export function ReusedVariableInvalidSecond() {
	const reusedInvalidClasses2 = 'invalid-reused-2';
	return <div className={reusedInvalidClasses2}>Reused invalid - second</div>;
}
