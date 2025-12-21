// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ❌ Invalid: Multiple binary expressions with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function MultipleBinaryInvalidClasses() {
	return (
		<div className={`flex ${isError && 'invalid-error'} ${hasWarning && 'invalid-warning'}`}>
			Multiple binary expressions with invalid classes
		</div>
	);
}
