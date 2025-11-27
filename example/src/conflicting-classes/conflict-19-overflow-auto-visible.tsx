/**
 * ⚠️ Warning: overflow-auto vs overflow-visible conflict
 * @conflictClasses [overflow-auto, overflow-visible]
 */
export function OverflowAutoVisibleConflict() {
	return <div className="overflow-auto overflow-visible">Overflow auto vs visible conflict</div>;
}
