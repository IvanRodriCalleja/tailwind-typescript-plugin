// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Simple conditional with valid classes in both branches
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function SimpleConditionalAllValid() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
			Simple conditional with valid classes
		</div>
	);
}
