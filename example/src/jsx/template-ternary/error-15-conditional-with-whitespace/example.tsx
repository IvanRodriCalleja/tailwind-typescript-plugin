// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with whitespace and invalid classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex, bg-blue-500, bg-gray-500]
 */
export function ConditionalWithWhitespace() {
	return (
		<div className={`flex   ${isActive ? 'bg-blue-500' : 'bg-gray-500'}   invalid-class`}>
			Conditional with extra whitespace
		</div>
	);
}
