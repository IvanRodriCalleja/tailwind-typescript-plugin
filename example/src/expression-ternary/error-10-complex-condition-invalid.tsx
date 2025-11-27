// Simulate dynamic values that might come from props or state
const hasError = false;
const isLoading = false;

/**
 * ❌ Invalid: Ternary with complex condition and invalid class
 * @invalidClasses [invalid-alert]
 * @validClasses [bg-gray-500]
 */
export function ComplexConditionInvalid() {
	return (
		<div className={hasError || isLoading ? 'invalid-alert' : 'bg-gray-500'}>
			Complex condition invalid
		</div>
	);
}
