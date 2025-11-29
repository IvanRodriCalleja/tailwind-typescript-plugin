// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with invalid class in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [flex, bg-gray-500]
 */
export function ConditionalInvalidTrueBranch() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : 'bg-gray-500'}`}>
			Invalid class in true branch
		</div>
	);
}
