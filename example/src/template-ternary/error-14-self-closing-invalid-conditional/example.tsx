// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Self-closing element with invalid class in conditional
 * @invalidClasses [invalid-rounded]
 * @validClasses [w-full, h-auto, rounded-full]
 */
export function SelfClosingInvalidConditional() {
	return (
		<img
			className={`w-full h-auto ${isActive ? 'invalid-rounded' : 'rounded-full'}`}
			src="test.jpg"
			alt="test"
		/>
	);
}
