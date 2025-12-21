/**
 * ❌⚠️ Both invalid class error AND duplicate warning
 * @invalidClasses [invalidclass]
 * @duplicateClasses [flex, flex]
 * Should show:
 * - Error on "invalidclass" (not a valid Tailwind class)
 * - Warning on both "flex" occurrences (duplicate)
 */
export function InvalidAndDuplicate() {
	return <div className="flex invalidclass flex items-center">Invalid and duplicate</div>;
}
