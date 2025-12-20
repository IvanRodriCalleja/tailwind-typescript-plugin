// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ❌ Invalid: Single invalid class between interpolations
 * @invalidClasses [invalid-class]
 */
export function InvalidBetweenInterpolations() {
	return (
		<div className={`${dynamicClass} invalid-class ${anotherClass}`}>
			Invalid between interpolations
		</div>
	);
}
