/**
 * ❌ Invalid: Invalid class at the beginning
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidFirst() {
	return <div className={'invalidclass flex items-center'}>Invalid first</div>;
}
