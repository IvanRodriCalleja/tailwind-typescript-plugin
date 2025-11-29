// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Self-closing element with binary expression
 * @validClasses [rounded-lg, shadow-md]
 */
export function SelfClosingBinaryValid() {
	return <img className={isActive && 'rounded-lg shadow-md'} src="test.jpg" alt="test" />;
}
