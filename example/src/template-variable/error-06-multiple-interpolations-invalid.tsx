// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ❌ Invalid: Multiple interpolations with invalid classes in different positions
 * @invalidClasses [invalid-first, invalid-middle, invalid-last]
 * @validClasses [flex]
 */
export function MultipleInterpolationsWithInvalid() {
	return (
		<div
			className={`invalid-first ${dynamicClass} invalid-middle flex ${anotherClass} invalid-last`}>
			Multiple interpolations with invalid classes
		</div>
	);
}
