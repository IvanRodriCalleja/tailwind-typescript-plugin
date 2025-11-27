/**
 * ❌ Invalid: Variable assigned from binary AND expression with invalid
 * @invalidClasses [invalid-class]
 */
export function BinaryAndVariableInvalid() {
	const isActive = true;
	const binaryAndInvalid = isActive && 'invalid-class';
	return <div className={binaryAndInvalid}>Binary AND variable - invalid</div>;
}
