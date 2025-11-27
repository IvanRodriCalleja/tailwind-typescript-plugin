/**
 * ✅ Valid: Duplicate (same class) is not a conflict
 * This triggers duplicate detection, not conflict detection
 * @duplicateClasses [flex, flex]
 */
export function DuplicateNotConflict() {
	return <div className="flex flex items-center">Duplicate, not conflict</div>;
}
