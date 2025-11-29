// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;

/**
 * ❌ Invalid: Nested binary expressions with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function NestedBinaryInvalid() {
	return (
		<div className={`flex ${isError && isActive && 'invalid-nested'}`}>
			Nested binary with invalid
		</div>
	);
}
