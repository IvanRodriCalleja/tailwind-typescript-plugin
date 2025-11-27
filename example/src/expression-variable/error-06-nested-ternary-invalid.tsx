/**
 * ❌ Invalid: Nested ternary with invalid class in nested branch
 * @invalidClasses [invalid-nested]
 * @validClasses [bg-green-500, bg-gray-500]
 */
export function NestedTernaryVariableInvalid() {
	const isActive = true;
	const isDisabled = false;
	const nestedTernaryInvalid = isActive
		? isDisabled
			? 'invalid-nested'
			: 'bg-green-500'
		: 'bg-gray-500';
	return <div className={nestedTernaryInvalid}>Nested ternary variable - invalid</div>;
}
