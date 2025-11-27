/**
 * ❌ Invalid: Parenthesized binary with invalid class
 * @invalidClasses [invalid-class]
 */
export function ParenthesizedBinaryInvalid() {
	const isError = true;
	return <div className={isError && 'invalid-class'}>Invalid in binary</div>;
}
