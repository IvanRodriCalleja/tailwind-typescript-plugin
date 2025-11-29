/**
 * ❌ Invalid: Invalid class in the middle
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidMiddle() {
	return <div className={'flex invalidclass items-center'}>Invalid middle</div>;
}
