/**
 * ✅ Valid: Parenthesized ternary
 * @validClasses [bg-red-500, bg-blue-500]
 */
export function ParenthesizedTernary() {
	const isError = true;
	return <div className={isError ? 'bg-red-500' : 'bg-blue-500'}>Parenthesized ternary</div>;
}
