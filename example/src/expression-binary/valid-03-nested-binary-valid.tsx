// Simulate dynamic values that might come from props or state
const isError = true;
const isActive = true;

/**
 * ✅ Valid: Nested binary expressions
 * @validClasses [text-red-500, font-bold]
 */
export function NestedBinaryValid() {
	return <div className={isError && isActive && 'text-red-500 font-bold'}>Nested binary</div>;
}
