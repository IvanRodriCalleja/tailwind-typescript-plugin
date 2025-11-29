// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with invalid class in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [flex, bg-blue-500]
 */
export function ConditionalInvalidFalseBranch() {
	return (
		<div className={`flex ${isActive ? 'bg-blue-500' : 'invalid-inactive'}`}>
			Invalid class in false branch
		</div>
	);
}
