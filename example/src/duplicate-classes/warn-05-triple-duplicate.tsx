/**
 * ⚠️ Warning: Same class appears three times
 * @duplicateClasses [flex, flex, flex]
 * All three "flex" occurrences should show warnings
 */
export function TripleDuplicate() {
	return <div className="flex flex flex items-center">Triple duplicate</div>;
}
