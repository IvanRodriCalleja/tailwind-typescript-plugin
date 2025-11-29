// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Direct ternary with invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 */
export function DirectTernaryInvalidBoth() {
	return (
		<div className={isActive ? 'invalid-active' : 'invalid-inactive'}>Invalid in both branches</div>
	);
}
