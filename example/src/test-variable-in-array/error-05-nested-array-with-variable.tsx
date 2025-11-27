/**
 * ❌ Invalid: Variables in nested array with invalid class
 * @invalidClasses [invalid-array-var]
 */
export function TestNestedArrayWithVariable() {
	const validClass = 'flex';
	const invalidClass = 'invalid-array-var';
	return <div className={[validClass, [invalidClass, 'grid']]}>Nested array with var</div>;
}
