// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary with empty string (no classes to validate)
 */
export function BinaryWithEmptyString() {
	return <div className={isError && ''}>Binary with empty string</div>;
}
