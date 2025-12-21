/**
 * ❌ Invalid: Combination with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesesAndTypeAssertionInvalid() {
	return <div className={'flex invalid-class' as string}>Combined invalid</div>;
}
