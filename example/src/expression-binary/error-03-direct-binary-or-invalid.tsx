// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Direct OR binary expression with invalid class
 * @invalidClasses [invalid-fallback]
 */
export function DirectBinaryOrInvalid() {
	return <div className={isError || 'invalid-fallback'}>OR with invalid class</div>;
}
