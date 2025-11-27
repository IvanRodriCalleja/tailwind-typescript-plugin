/**
 * ⚠️ Warning: Both duplicate and conflict
 * @duplicateClasses [flex, flex]
 * @conflictClasses [flex, flex, block]
 */
export function DuplicateAndConflict() {
	return <div className="flex flex block items-center">Duplicate and conflict</div>;
}
