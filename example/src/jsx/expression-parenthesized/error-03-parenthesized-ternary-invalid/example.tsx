/**
 * ❌ Invalid: Parenthesized ternary with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [bg-blue-500]
 */
export function ParenthesizedTernaryInvalid() {
	const isError = true;
	return <div className={isError ? 'invalid-class' : 'bg-blue-500'}>Invalid in ternary</div>;
}
