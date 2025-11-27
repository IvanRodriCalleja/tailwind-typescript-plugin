/**
 * ⚠️ Warning: text-justify vs text-left conflict
 * @conflictClasses [text-left, text-justify]
 */
export function TextJustifyConflict() {
	return <div className="text-left text-justify">Text justify conflict</div>;
}
