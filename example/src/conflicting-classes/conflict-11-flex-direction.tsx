/**
 * ⚠️ Warning: flex-row vs flex-col conflict
 * @conflictClasses [flex-row, flex-col]
 */
export function FlexDirectionConflict() {
	return <div className="flex flex-row flex-col">Flex direction conflict</div>;
}
