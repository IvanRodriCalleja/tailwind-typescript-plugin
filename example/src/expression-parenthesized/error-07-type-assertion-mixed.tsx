/**
 * ❌ Invalid: Type assertion with mixed classes
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function TypeAssertionMixed() {
	return <div className={'flex invalid-class' as string}>Type assertion mixed</div>;
}
