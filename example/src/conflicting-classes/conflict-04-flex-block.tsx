/**
 * ⚠️ Warning: flex vs block conflict
 * @conflictClasses [flex, block]
 * Both set the display property
 */
export function FlexBlockConflict() {
	return <div className="flex block">Flex vs block conflict</div>;
}
