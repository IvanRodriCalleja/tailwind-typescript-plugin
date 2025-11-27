// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Multiple elements with different validation results
 * @element {1} First child with invalid in binary
 * @invalidClasses {1} [invalid-error]
 * @element {2} Second child with all valid
 * @validClasses {2} [text-red-500]
 * @element {3} Third child with invalid
 * @invalidClasses {3} [invalid-class]
 */
export function MultipleElements() {
	return (
		<div className="flex flex-col">
			<div className={isError && 'invalid-error'}>Invalid in first child</div>
			<div className={isError && 'text-red-500'}>Valid in second child</div>
			<div className={isError && 'invalid-class'}>Invalid in third child</div>
		</div>
	);
}
