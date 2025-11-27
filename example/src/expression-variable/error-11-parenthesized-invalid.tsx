/**
 * ❌ Invalid: Variable with parenthesized expression containing invalid
 * @invalidClasses [invalid-paren]
 */
export function ParenthesizedInvalid() {
	const parenthesizedInvalid = 'invalid-paren';
	return <div className={parenthesizedInvalid}>Parenthesized expression - invalid</div>;
}
