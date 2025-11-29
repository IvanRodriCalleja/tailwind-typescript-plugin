/**
 * ❌ Invalid: Variable assigned from binary OR expression with invalid
 * @invalidClasses [invalid-fallback]
 */
export function BinaryOrVariableInvalid() {
	const isDisabled = false;
	const binaryOrInvalid = isDisabled || 'invalid-fallback';
	return <div className={binaryOrInvalid}>Binary OR variable - invalid</div>;
}
