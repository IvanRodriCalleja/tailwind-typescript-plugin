// Simulate dynamic values that might come from props or state
const isActive = true;
const isDisabled = false;

/**
 * ✅ Valid: Ternary with complex condition
 * @validClasses [bg-red-500, bg-gray-500]
 */
export function ComplexConditionValid() {
	return (
		<div className={isActive && !isDisabled ? 'bg-red-500' : 'bg-gray-500'}>Complex condition</div>
	);
}
