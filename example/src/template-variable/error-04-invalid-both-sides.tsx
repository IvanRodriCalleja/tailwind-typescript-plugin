// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Template literal with interpolation, invalid classes on both sides
 * @invalidClasses [invalid-before, invalid-after]
 */
export function SingleInterpolationInvalidBoth() {
	return (
		<div className={`invalid-before ${dynamicClass} invalid-after`}>
			Invalid before and after interpolation
		</div>
	);
}
