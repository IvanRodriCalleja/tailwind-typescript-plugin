// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Direct binary expression with valid class
 * @validClasses [text-red-500]
 */
export function DirectBinaryAllValid() {
	return <div className={isError && 'text-red-500'}>Direct binary expression</div>;
}
