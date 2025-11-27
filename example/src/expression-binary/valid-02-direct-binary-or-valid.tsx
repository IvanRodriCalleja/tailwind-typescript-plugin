// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Direct OR binary expression
 * @validClasses [bg-gray-500]
 */
export function DirectBinaryOrValid() {
	return <div className={isError || 'bg-gray-500'}>Direct OR expression</div>;
}
