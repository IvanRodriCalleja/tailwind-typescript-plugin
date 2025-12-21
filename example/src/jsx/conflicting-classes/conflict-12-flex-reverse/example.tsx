/**
 * ⚠️ Warning: flex-row-reverse vs flex-col conflict
 * @conflictClasses [flex-row-reverse, flex-col]
 */
export function FlexReverseConflict() {
	return <div className="flex flex-row-reverse flex-col">Flex reverse conflict</div>;
}
