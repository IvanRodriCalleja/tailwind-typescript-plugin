/**
 * ✅ Valid: Variable assigned from binary OR expression
 * @validClasses [bg-blue-500]
 */
export function BinaryOrVariableValid() {
	const isDisabled = false;
	const binaryOrValid = isDisabled || 'bg-blue-500';
	return <div className={binaryOrValid}>Binary OR variable - valid</div>;
}
