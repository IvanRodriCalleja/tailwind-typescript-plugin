/**
 * ⚠️ Warning: hidden conflicts with flex
 * @conflictClasses [flex, hidden]
 * hidden sets display: none
 */
export function HiddenFlexConflict() {
	return <div className="flex hidden">Hidden vs flex conflict</div>;
}
