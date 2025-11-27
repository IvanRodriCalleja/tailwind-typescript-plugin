// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 */
export function NestedBinaryInvalid() {
	return <div className={isError && isActive && 'invalid-nested'}>Nested binary invalid</div>;
}
