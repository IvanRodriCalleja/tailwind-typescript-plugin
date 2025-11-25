/**
 * Test: Variables used inside array expressions
 */

const validClass = 'flex';
const invalidClass = 'invalid-array-var';
const mixedClasses = 'items-center invalid-mixed-array';

// Ternary variable
const isActive = true;
const ternaryClass = isActive ? 'bg-blue-500' : 'invalid-ternary-array';

export function TestVariableInArrayValid() {
	return <div className={[validClass, 'items-center']}>Valid var in array</div>;
}

export function TestVariableInArrayInvalid() {
	return <div className={[invalidClass, 'flex']}>Invalid var in array</div>;
}

export function TestVariableInArrayMixed() {
	return <div className={[mixedClasses, 'justify-between']}>Mixed var in array</div>;
}

export function TestMultipleVariablesInArray() {
	return <div className={[validClass, invalidClass, 'p-4']}>Multiple vars in array</div>;
}

export function TestTernaryVariableInArray() {
	return <div className={[ternaryClass, 'rounded']}>Ternary var in array</div>;
}

// Nested array with variables
export function TestNestedArrayWithVariable() {
	return <div className={[validClass, [invalidClass, 'grid']]}>Nested array with var</div>;
}
