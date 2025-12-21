// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary combined with static in template
 * Note: This is a template literal pattern, not pure expression
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function TernaryWithStaticWrapper() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>Ternary in template</div>
	);
}
