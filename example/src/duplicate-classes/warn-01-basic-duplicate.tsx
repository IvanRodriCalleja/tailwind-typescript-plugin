/**
 * ⚠️ Warning: Same class appears twice
 * @duplicateClasses [flex, flex]
 * Both occurrences of "flex" should show warning
 */
export function SimpleDuplicate() {
	return <div className="flex flex items-center">Simple duplicate</div>;
}
