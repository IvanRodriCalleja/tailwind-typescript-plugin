/**
 * ✅ Valid: Variable assigned from binary AND expression
 * @validClasses [bg-blue-500]
 */
export function BinaryAndVariableValid() {
	const isActive = true;
	const binaryAndValid = isActive && 'bg-blue-500';
	return <div className={binaryAndValid}>Binary AND variable - valid</div>;
}
