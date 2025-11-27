// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional with empty string in false branch
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ConditionalWithEmptyString() {
	return (
		<div className={`flex items-center ${isActive ? 'bg-blue-500' : ''}`}>
			Conditional with empty string
		</div>
	);
}
