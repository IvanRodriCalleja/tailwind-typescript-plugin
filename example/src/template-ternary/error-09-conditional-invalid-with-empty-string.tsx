// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with invalid class and empty string
 * @invalidClasses [invalid-active]
 * @validClasses [flex]
 */
export function ConditionalInvalidWithEmptyString() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : ''}`}>
			Invalid class with empty string fallback
		</div>
	);
}
