// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Template literal with interpolation, invalid class before interpolation
 * @invalidClasses [invalid-before]
 */
export function SingleInterpolationInvalidBefore() {
	return <div className={`invalid-before ${dynamicClass}`}>Invalid before interpolation</div>;
}
