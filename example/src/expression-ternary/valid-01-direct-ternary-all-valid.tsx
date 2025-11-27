// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Direct ternary expression with all valid classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function DirectTernaryAllValid() {
	return <div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Direct ternary expression</div>;
}
