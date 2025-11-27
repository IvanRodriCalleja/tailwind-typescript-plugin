/**
 * ✅ Valid: Variable with valid class used in array
 * @validClasses [flex, items-center]
 */
export function TestVariableInArrayValid() {
	const validClass = 'flex';
	return <div className={[validClass, 'items-center']}>Valid var in array</div>;
}
