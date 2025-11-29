// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with undefined result (ignored)
 * @validClasses [bg-gray-500]
 */
export function TernaryWithUndefinedResult() {
	return <div className={isActive ? undefined : 'bg-gray-500'}>Ternary with undefined</div>;
}
