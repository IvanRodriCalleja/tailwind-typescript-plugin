// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 */
export function TernaryWithEmptyAndInvalid() {
	return <div className={isActive ? 'invalid-class' : ''}>Invalid with empty</div>;
}
