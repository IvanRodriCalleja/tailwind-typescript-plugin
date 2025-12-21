// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Conditional with invalid classes in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 * @validClasses [flex]
 */
export function ConditionalInvalidBothBranches() {
	return (
		<div className={`flex ${isActive ? 'invalid-active' : 'invalid-inactive'}`}>
			Invalid classes in both branches
		</div>
	);
}
