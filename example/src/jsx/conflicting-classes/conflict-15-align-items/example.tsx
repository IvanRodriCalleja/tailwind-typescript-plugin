/**
 * ⚠️ Warning: items-start vs items-center conflict
 * @conflictClasses [items-start, items-center]
 */
export function AlignItemsConflict() {
	return <div className="flex items-start items-center">Align items conflict</div>;
}
