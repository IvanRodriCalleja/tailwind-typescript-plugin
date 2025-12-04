/**
 * ❌ Invalid: Custom attribute with invalid class
 * Uses 'containerStyles' as a custom class attribute with an invalid class
 * @invalidClasses [invalid-class]
 */
export function CustomAttributeInvalid() {
	return <div containerStyles="invalid-class">Custom attribute with invalid class</div>;
}
