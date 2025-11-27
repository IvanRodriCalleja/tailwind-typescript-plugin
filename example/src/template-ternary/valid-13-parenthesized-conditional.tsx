// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Parenthesized conditional expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ParenthesizedConditional() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
			Parenthesized conditional
		</div>
	);
}
