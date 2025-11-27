/**
 * ⚠️ Warning: Multiple text alignment conflicts
 * @conflictClasses [text-left, text-center, text-right]
 * All three set the same property - text-align
 */
export function MultipleTextAlignConflicts() {
	return <div className="text-left text-center text-right">Multiple text-align conflicts</div>;
}
