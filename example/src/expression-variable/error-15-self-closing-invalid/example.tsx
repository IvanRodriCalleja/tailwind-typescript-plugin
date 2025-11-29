/**
 * ❌ Invalid: Self-closing element with invalid variable
 * @invalidClasses [invalid-img-class]
 * @validClasses [w-full]
 */
export function SelfClosingWithInvalidVariable() {
	const invalidImgClasses = 'w-full invalid-img-class';
	return <img className={invalidImgClasses} src="test.jpg" alt="test" />;
}
