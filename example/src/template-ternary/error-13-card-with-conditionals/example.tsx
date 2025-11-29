// Simulate dynamic values that might come from props or state
const isActive = true;
const isError = false;

/**
 * ❌ Invalid: Card component with various conditionals and invalid classes
 * @invalidClasses [invalid-shadow, invalid-border]
 * @validClasses [p-6, rounded-lg, bg-white, dark:bg-gray-800, shadow-lg, border, border-gray-200, dark:border-gray-700, border-red-500]
 */
export function CardWithConditionals() {
	return (
		<div
			className={`p-6 rounded-lg ${isActive ? 'bg-white dark:bg-gray-800 invalid-shadow' : 'bg-white'} ${isError ? 'border border-red-500' : 'border invalid-border dark:border-gray-700'}`}>
			Card content
		</div>
	);
}
