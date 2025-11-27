// Simulate dynamic values that might come from props or state
const isError = true;

/**
 * ✅ Valid: Binary expression combined with static wrapper
 * Note: This is actually a template literal pattern, not pure expression
 * @validClasses [flex, text-red-500]
 */
export function BinaryWithStaticWrapper() {
	return <div className={`flex ${isError && 'text-red-500'}`}>Binary in template</div>;
}
