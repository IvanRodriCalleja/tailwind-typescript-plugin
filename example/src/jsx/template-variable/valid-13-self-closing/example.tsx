// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Self-closing element with template literal and interpolation
 * @validClasses [w-full, h-auto]
 */
export function SelfClosingWithInterpolation() {
	return <img className={`w-full ${dynamicClass} h-auto`} src="test.jpg" alt="test" />;
}
