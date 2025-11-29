// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Template literal with interpolation, invalid class after interpolation
 * @invalidClasses [invalid-after]
 */
export function SingleInterpolationInvalidAfter() {
	return <div className={`${dynamicClass} invalid-after`}>Invalid after interpolation</div>;
}
