// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Conditional with empty string in true branch
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalEmptyStringInTrue() {
	return <div className={`flex ${isActive ? '' : 'bg-gray-500'}`}>Empty in true branch</div>;
}
