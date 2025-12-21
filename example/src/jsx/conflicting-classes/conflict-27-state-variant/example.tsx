/**
 * ⚠️ Warning: Conflicts with same state variant
 * @conflictClasses [hover:block, hover:flex]
 */
export function StateVariantConflict() {
	return <div className="hover:block hover:flex">State variant conflict</div>;
}
