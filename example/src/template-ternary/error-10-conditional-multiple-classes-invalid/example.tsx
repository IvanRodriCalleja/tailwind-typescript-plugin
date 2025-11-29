// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional branches with multiple classes, some invalid
 * @invalidClasses [invalid-bg, invalid-text]
 * @validClasses [flex, text-white, font-bold, text-black]
 */
export function ConditionalMultipleClassesInvalid() {
	return (
		<div
			className={`flex ${isActive ? 'invalid-bg text-white font-bold' : 'invalid-text text-black'}`}>
			Conditional with multiple classes, some invalid
		</div>
	);
}
