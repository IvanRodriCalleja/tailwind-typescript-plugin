// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Parenthesized binary expression
 * @validClasses [text-red-500]
 */
export function ParenthesizedBinaryValid() {
	return <div className={isError && 'text-red-500'}>Parenthesized binary</div>;
}
