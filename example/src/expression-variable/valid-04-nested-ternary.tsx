/**
 * ✅ Valid: Nested ternary variable assignment
 * @validClasses [bg-blue-500, bg-green-500, bg-gray-500]
 */
export function NestedTernaryVariableValid() {
	const isActive = true;
	const isDisabled = false;
	const nestedTernaryValid = isActive
		? isDisabled
			? 'bg-blue-500'
			: 'bg-green-500'
		: 'bg-gray-500';
	return <div className={nestedTernaryValid}>Nested ternary variable - valid</div>;
}
