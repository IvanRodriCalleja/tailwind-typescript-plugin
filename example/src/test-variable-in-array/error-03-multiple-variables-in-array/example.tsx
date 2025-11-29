/**
 * ❌ Invalid: Multiple variables in array, one with invalid class
 * @invalidClasses [invalid-array-var]
 */
export function TestMultipleVariablesInArray() {
	const validClass = 'flex';
	const invalidClass = 'invalid-array-var';
	return <div className={[validClass, invalidClass, 'p-4']}>Multiple vars in array</div>;
}
