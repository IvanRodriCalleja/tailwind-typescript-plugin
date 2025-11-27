// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Static invalid class after binary expression
 * @invalidClasses [invalid-after]
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithInvalidAfter() {
	return (
		<div className={`flex ${isError && 'text-red-500'} invalid-after`}>
			Binary with invalid after
		</div>
	);
}
