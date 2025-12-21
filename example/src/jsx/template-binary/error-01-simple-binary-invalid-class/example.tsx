// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Binary expression with invalid class
 * @invalidClasses [invalid-error]
 * @validClasses [flex]
 */
export function SimpleBinaryInvalidClass() {
	return (
		<div className={`flex ${isError && 'invalid-error'}`}>Binary expression with invalid class</div>
	);
}
