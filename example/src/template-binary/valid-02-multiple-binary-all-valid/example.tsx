// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ✅ Valid: Multiple binary expressions with valid classes
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function MultipleBinaryAllValid() {
	return (
		<div className={`flex ${isError && 'text-red-500'} ${hasWarning && 'bg-yellow-100'}`}>
			Multiple binary expressions with valid classes
		</div>
	);
}
