// Simulate dynamic values that might come from props or state
const isActive = true;
const isError = false;

/**
 * ❌ Invalid: Multiple conditionals with some invalid classes
 * @invalidClasses [invalid-bg, invalid-text]
 * @validClasses [flex, bg-blue-500, text-white]
 */
export function MultipleConditionalsWithInvalid() {
	return (
		<div
			className={`flex ${isActive ? 'bg-blue-500' : 'invalid-bg'} ${isError ? 'invalid-text' : 'text-white'}`}>
			Multiple conditionals with invalid classes
		</div>
	);
}
