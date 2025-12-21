// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ❌ Invalid: Binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [text-red-500, font-bold]
 */
export function DirectBinaryMultipleClasses() {
	return (
		<div className={isError && 'text-red-500 invalid-class font-bold'}>
			Binary with multiple classes
		</div>
	);
}
