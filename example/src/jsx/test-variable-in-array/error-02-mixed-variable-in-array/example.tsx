/**
 * ❌ Invalid: Variable with mixed valid and invalid classes used in array
 * @invalidClasses [invalid-mixed-array]
 */
export function TestVariableInArrayMixed() {
	const mixedClasses = 'items-center invalid-mixed-array';
	return <div className={[mixedClasses, 'justify-between']}>Mixed var in array</div>;
}
