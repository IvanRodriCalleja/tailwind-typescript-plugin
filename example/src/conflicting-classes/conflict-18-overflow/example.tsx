/**
 * ⚠️ Warning: overflow-hidden vs overflow-scroll conflict
 * @conflictClasses [overflow-hidden, overflow-scroll]
 */
export function OverflowConflict() {
	return <div className="overflow-hidden overflow-scroll">Overflow conflict</div>;
}
