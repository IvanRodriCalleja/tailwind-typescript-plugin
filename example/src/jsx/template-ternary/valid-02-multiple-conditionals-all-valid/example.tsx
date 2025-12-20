// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Multiple conditionals with valid classes
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
 */
export function MultipleConditionalsAllValid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'} ${isActive ? 'text-white' : 'text-black'}`}>
			Multiple conditionals with valid classes
		</div>
	);
}
