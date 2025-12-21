// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional with variants
 * @validClasses [flex, hover:bg-blue-500, hover:bg-gray-500]
 */
export function ConditionalWithVariants() {
	return (
		<div className={`flex ${isActive ? 'hover:bg-blue-500' : 'hover:bg-gray-500'}`}>
			Conditional with hover variants
		</div>
	);
}
