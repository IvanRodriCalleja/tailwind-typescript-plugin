/**
 * ❌ Invalid: Invalid class with valid variant
 * @invalidClasses [hover:invalidclass]
 */
export function InvalidClassWithValidVariant() {
	return <div className="hover:invalidclass">Invalid class with valid variant</div>;
}
