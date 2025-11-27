// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Self-closing element with ternary expression
 * @validClasses [rounded-lg, rounded-sm]
 */
export function SelfClosingTernaryValid() {
	return <img className={isActive ? 'rounded-lg' : 'rounded-sm'} src="test.jpg" alt="test" />;
}
