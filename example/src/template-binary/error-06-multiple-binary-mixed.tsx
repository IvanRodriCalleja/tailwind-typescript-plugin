// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ❌ Invalid: Mix of valid and invalid binary expressions
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function MultipleBinaryMixed() {
	return (
		<div className={`flex ${isError && 'text-red-500'} ${hasWarning && 'invalid-warning'}`}>
			Mix of valid and invalid binary expressions
		</div>
	);
}
