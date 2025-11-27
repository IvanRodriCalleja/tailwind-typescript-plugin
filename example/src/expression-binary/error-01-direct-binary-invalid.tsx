// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Direct binary expression with invalid class
 * @invalidClasses [invalid-error]
 */
export function DirectBinaryInvalid() {
	return <div className={isError && 'invalid-error'}>Direct binary with invalid</div>;
}
