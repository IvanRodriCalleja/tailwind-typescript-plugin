// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Parenthesized binary with invalid
 * @invalidClasses [invalid-error]
 */
export function ParenthesizedBinaryInvalid() {
	return <div className={isError && 'invalid-error'}>Parenthesized with invalid</div>;
}
