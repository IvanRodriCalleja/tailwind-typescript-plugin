// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Direct ternary with invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [bg-blue-500]
 */
export function DirectTernaryInvalidFalse() {
	return (
		<div className={isActive ? 'bg-blue-500' : 'invalid-inactive'}>Invalid in false branch</div>
	);
}
