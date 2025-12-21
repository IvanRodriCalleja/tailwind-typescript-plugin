/**
 * ❌ Invalid: Invalid class at the end
 * @invalidClasses [invalidclass]
 * @validClasses [flex, items-center]
 */
export function MultipleClassesInvalidLast() {
	return <div className={'flex items-center invalidclass'}>Invalid last</div>;
}
