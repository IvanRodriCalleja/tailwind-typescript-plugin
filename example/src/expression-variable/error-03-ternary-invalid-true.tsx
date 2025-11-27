/**
 * ❌ Invalid: Variable assigned from ternary with invalid in true branch
 * @invalidClasses [invalid-active]
 * @validClasses [bg-gray-500]
 */
export function TernaryVariableInvalidTrue() {
	const isActive = true;
	const ternaryInvalidTrue = isActive ? 'invalid-active' : 'bg-gray-500';
	return <div className={ternaryInvalidTrue}>Ternary variable - invalid in true</div>;
}
