/**
 * ❌ Invalid: Variable with as const assertion containing invalid
 * @invalidClasses [invalid-const]
 */
export function AsConstInvalid() {
	const asConstInvalid = 'invalid-const' as const;
	return <div className={asConstInvalid}>As const assertion - invalid</div>;
}
