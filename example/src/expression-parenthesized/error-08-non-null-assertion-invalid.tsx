/**
 * ❌ Invalid: Non-null assertion with invalid class
 * @invalidClasses [invalid-class]
 */
export function NonNullAssertionInvalid() {
	const className: string | null = 'invalid-class';
	return <div className={className!}>Non-null invalid</div>;
}
