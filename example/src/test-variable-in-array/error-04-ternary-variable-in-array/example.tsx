/**
 * ❌ Invalid: Ternary variable with invalid class in false branch used in array
 * @invalidClasses [invalid-ternary-array]
 */
export function TestTernaryVariableInArray() {
	const isActive = true;
	const ternaryClass = isActive ? 'bg-blue-500' : 'invalid-ternary-array';
	return <div className={[ternaryClass, 'rounded']}>Ternary var in array</div>;
}
