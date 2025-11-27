// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Parenthesized ternary with invalid
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function ParenthesizedTernaryInvalid() {
	return (
		<div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Parenthesized with invalid</div>
	);
}
