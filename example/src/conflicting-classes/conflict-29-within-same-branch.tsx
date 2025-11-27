/**
 * ⚠️ Warning: Conflicts WITHIN same ternary branch
 * @conflictClasses [text-left, text-center]
 * Both text-left and text-center are in the true branch
 */
export function ConflictWithinSameBranch() {
	const isActive = true;
	return (
		<div className={isActive ? 'text-left text-center' : 'text-right'}>
			Conflict within same branch
		</div>
	);
}
