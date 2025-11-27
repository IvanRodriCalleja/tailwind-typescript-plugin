// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Self-closing element with invalid in binary
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function SelfClosingBinaryInvalid() {
	return <img className={isActive && 'rounded-lg invalid-style'} src="test.jpg" alt="test" />;
}
