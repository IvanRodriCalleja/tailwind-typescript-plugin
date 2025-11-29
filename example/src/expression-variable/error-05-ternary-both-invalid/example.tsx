/**
 * ❌ Invalid: Variable assigned from ternary with invalid in both branches
 * @invalidClasses [invalid-active, invalid-inactive]
 */
export function TernaryVariableBothInvalid() {
	const isActive = true;
	const ternaryBothInvalid = isActive ? 'invalid-active' : 'invalid-inactive';
	return <div className={ternaryBothInvalid}>Ternary variable - both invalid</div>;
}
