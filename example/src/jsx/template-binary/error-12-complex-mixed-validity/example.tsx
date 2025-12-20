// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;
const isDisabled = false;

/**
 * ❌ Invalid: Multiple conditions with mixed validity
 * @invalidClasses [invalid-disabled]
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function ComplexMixedValidity() {
	return (
		<div
			className={`flex ${isError && 'text-red-500'} ${hasWarning && 'bg-yellow-100'} ${isDisabled && 'invalid-disabled'}`}>
			Complex mixed validity
		</div>
	);
}
