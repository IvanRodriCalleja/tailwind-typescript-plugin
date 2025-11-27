// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Binary expression with multiple classes, one invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, text-red-500, font-bold]
 */
export function BinaryWithMultipleClasses() {
	return (
		<div className={`flex ${isError && 'text-red-500 invalid-class font-bold'}`}>
			Binary with multiple classes
		</div>
	);
}
