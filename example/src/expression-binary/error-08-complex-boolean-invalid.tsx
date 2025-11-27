// Simulate dynamic values that might come from props or state
const isError = true;
const hasWarning = false;

/**
 * ❌ Invalid: Complex boolean with invalid class
 * @invalidClasses [invalid-alert]
 */
export function ComplexBooleanInvalid() {
	return <div className={(isError || hasWarning) && 'invalid-alert'}>Complex boolean invalid</div>;
}
