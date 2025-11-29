// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in ternary
 * @invalidClasses {1} [invalid-active]
 * @validClasses {1} [bg-gray-500]
 * @element {2} Second child with all valid
 * @validClasses {2} [bg-blue-500, bg-gray-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 * @validClasses {3} [bg-gray-500]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={isActive ? 'invalid-active' : 'bg-gray-500'}>Invalid in first child</div>
			<div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Valid in second child</div>
			<div className={isActive ? 'invalid-class' : 'bg-gray-500'}>Invalid in third child</div>
		</div>
	);
}
