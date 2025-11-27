// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Self-closing element with invalid class in template
 * @invalidClasses [invalid-class]
 * @validClasses [w-full]
 */
export function SelfClosingInvalidWithInterpolation() {
	return <img className={`invalid-class ${dynamicClass} w-full`} src="test.jpg" alt="test" />;
}
