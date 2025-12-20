// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary expression with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function BinaryWithInvalidVariant() {
	return (
		<div className={`flex ${isActive && 'invalid-variant:bg-blue'}`}>
			Binary with invalid variant
		</div>
	);
}
