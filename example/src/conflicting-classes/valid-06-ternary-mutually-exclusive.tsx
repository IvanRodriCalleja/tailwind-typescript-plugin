/**
 * ✅ Valid: Conflicting classes in DIFFERENT ternary branches - no conflict
 * text-left in true branch, text-center in false branch are mutually exclusive
 */
export function TernaryMutuallyExclusive() {
	const isActive = true;
	return (
		<div className={isActive ? 'text-left' : 'text-center'}>
			Ternary mutually exclusive - no conflict
		</div>
	);
}
