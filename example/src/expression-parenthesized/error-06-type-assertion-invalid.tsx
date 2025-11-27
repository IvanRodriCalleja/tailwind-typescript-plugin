/**
 * ❌ Invalid: Type assertion with invalid class
 * @invalidClasses [invalid-class]
 */
export function TypeAssertionInvalid() {
	return <div className={'invalid-class' as string}>Type assertion invalid</div>;
}
