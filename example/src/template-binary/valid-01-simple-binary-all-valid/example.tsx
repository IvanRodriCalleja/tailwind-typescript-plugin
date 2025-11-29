// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ✅ Valid: Simple binary expression with valid class
 * @validClasses [flex, text-red-500]
 */
export function SimpleBinaryAllValid() {
	return (
		<div className={`flex ${isError && 'text-red-500'}`}>
			Simple binary expression with valid class
		</div>
	);
}
