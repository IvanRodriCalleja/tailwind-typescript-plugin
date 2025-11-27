// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Direct ternary with invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function DirectTernaryInvalidTrue() {
	return <div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Invalid in true branch</div>;
}
