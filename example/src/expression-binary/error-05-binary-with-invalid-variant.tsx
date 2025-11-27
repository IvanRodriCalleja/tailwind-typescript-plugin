// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 */
export function BinaryWithInvalidVariant() {
	return <div className={isActive && 'invalid-variant:bg-blue'}>Binary with invalid variant</div>;
}
