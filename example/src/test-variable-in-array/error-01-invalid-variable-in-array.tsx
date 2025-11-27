/**
 * ❌ Invalid: Variable with invalid class used in array
 * @invalidClasses [invalid-array-var]
 */
export function TestVariableInArrayInvalid() {
	const invalidClass = 'invalid-array-var';
	return <div className={[invalidClass, 'flex']}>Invalid var in array</div>;
}
