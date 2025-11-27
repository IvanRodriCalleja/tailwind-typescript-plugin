/**
 * ❌ Invalid: Variable assigned from ternary with invalid in false branch
 * @invalidClasses [invalid-inactive]
 * @validClasses [bg-blue-500]
 */
export function TernaryVariableInvalidFalse() {
	const isActive = true;
	const ternaryInvalidFalse = isActive ? 'bg-blue-500' : 'invalid-inactive';
	return <div className={ternaryInvalidFalse}>Ternary variable - invalid in false</div>;
}
