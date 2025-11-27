/**
 * ✅ Valid: Variable assigned from ternary with all valid classes
 * @validClasses [bg-blue-500, bg-gray-500]
 */
export function TernaryVariableAllValid() {
	const isActive = true;
	const ternaryValidClasses = isActive ? 'bg-blue-500' : 'bg-gray-500';
	return <div className={ternaryValidClasses}>Ternary variable - all valid</div>;
}
