// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ✅ Valid: Nested ternary expressions
 * @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
 */
export function NestedTernaryValid() {
	return (
		<div className={isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'}>
			Nested ternary
		</div>
	);
}
