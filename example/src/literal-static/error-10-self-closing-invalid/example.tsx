/**
 * ❌ Invalid: Self-closing element with invalid class
 * @invalidClasses [invalidclass]
 * @validClasses [w-full]
 */
export function SelfClosingInvalid() {
	return <img className="invalidclass w-full" src="test.jpg" alt="test" />;
}
