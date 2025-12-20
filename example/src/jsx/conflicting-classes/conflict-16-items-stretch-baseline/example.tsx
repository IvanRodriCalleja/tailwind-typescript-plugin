/**
 * ⚠️ Warning: items-stretch vs items-baseline conflict
 * @conflictClasses [items-stretch, items-baseline]
 */
export function ItemsStretchBaselineConflict() {
	return (
		<div className="flex items-stretch items-baseline">Items stretch vs baseline conflict</div>
	);
}
