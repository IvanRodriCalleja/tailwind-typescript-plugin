/**
 * ⚠️ Warning: whitespace-nowrap vs whitespace-normal conflict
 * @conflictClasses [whitespace-nowrap, whitespace-normal]
 */
export function WhitespaceConflict() {
	return <div className="whitespace-nowrap whitespace-normal">Whitespace conflict</div>;
}
