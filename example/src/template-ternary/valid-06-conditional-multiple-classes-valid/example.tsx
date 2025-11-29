// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional branches with multiple valid classes
 * @validClasses [flex, bg-blue-500, text-white, font-bold, bg-gray-500, text-black]
 */
export function ConditionalMultipleClassesValid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500 text-white font-bold' : 'bg-gray-500 text-black'}`}>
			Conditional with multiple classes per branch
		</div>
	);
}
