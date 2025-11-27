/**
 * ⚠️ Warning: text-wrap vs text-nowrap conflict
 * @conflictClasses [text-wrap, text-nowrap]
 */
export function TextWrapConflict() {
	return <div className="text-wrap text-nowrap">Text wrap conflict</div>;
}
