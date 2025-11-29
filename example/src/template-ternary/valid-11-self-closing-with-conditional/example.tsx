// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Self-closing element with conditional
 * @validClasses [w-full, h-auto, rounded, rounded-full]
 */
export function SelfClosingWithConditional() {
	return (
		<img
			className={`w-full h-auto ${isActive ? 'rounded' : 'rounded-full'}`}
			src="test.jpg"
			alt="test"
		/>
	);
}
