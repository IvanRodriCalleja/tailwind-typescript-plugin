/**
 * ✅ Valid: Nested parentheses
 * @validClasses [bg-green-500, bg-gray-500]
 */
export function NestedParentheses() {
	const isActive = true;
	return <div className={isActive ? 'bg-green-500' : 'bg-gray-500'}>Nested parentheses</div>;
}
