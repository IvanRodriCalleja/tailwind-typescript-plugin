/**
 * ❌ Invalid: Nested parentheses with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [bg-gray-500]
 */
export function NestedParenthesesInvalid() {
	const isActive = true;
	return <div className={isActive ? 'invalid-class' : 'bg-gray-500'}>Nested invalid</div>;
}
