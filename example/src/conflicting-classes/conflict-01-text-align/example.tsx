/**
 * ⚠️ Warning: Conflicting text alignment classes
 * @conflictClasses [text-left, text-center]
 * Both text-left and text-center set text-align property
 */
export function TextAlignConflict() {
	return <div className="text-left text-center">Text alignment conflict</div>;
}
