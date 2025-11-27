/**
 * ⚠️ Warning: cursor-pointer vs cursor-not-allowed conflict
 * @conflictClasses [cursor-pointer, cursor-not-allowed]
 */
export function CursorConflict() {
	return <div className="cursor-pointer cursor-not-allowed">Cursor conflict</div>;
}
