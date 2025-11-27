// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with static invalid class before conditional
 * @invalidClasses [invalid-class, invalid-bg]
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalWithStaticInvalid() {
	return (
		<div className={`flex invalid-class ${isActive ? 'invalid-bg' : 'bg-gray-500'}`}>
			Static invalid class with conditional
		</div>
	);
}
