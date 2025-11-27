/**
 * ⚠️ Warning: Multiple different duplicates
 * @duplicateClasses [flex, flex, items-center, items-center]
 * All occurrences of both classes should show warnings
 */
export function MultipleDuplicates() {
	return <div className="flex items-center flex items-center">Multiple duplicates</div>;
}
