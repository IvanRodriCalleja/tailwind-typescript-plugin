// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Parenthesized ternary expression
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function ParenthesizedTernaryValid() {
	return <div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Parenthesized ternary</div>;
}
