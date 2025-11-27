/**
 * ❌ Invalid: Parenthesized mixed valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ParenthesizedMixed() {
	return <div className={'flex invalid-class'}>Parenthesized mixed</div>;
}
