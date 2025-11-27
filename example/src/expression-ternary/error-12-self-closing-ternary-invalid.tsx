// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Self-closing element with invalid in ternary
 * @invalidClasses [invalid-style]
 * @validClasses [rounded-lg]
 */
export function SelfClosingTernaryInvalid() {
	return <img className={isActive ? 'invalid-style' : 'rounded-lg'} src="test.jpg" alt="test" />;
}
