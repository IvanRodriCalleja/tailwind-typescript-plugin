/**
 * ✅ Valid: Parenthesized binary expression
 * @validClasses [bg-red-500]
 */
export function ParenthesizedBinary() {
	const isError = true;
	return <div className={isError && 'bg-red-500'}>Parenthesized binary</div>;
}
