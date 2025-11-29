// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with invalid variant
 * @invalidClasses [invalidvariant:bg-blue-500]
 * @validClasses [flex, hover:bg-gray-500]
 */
export function ConditionalWithInvalidVariant() {
	return (
		<div className={`flex ${isActive ? 'invalidvariant:bg-blue-500' : 'hover:bg-gray-500'}`}>
			Conditional with invalid variant
		</div>
	);
}
