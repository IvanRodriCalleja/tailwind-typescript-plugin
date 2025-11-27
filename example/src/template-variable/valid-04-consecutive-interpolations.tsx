// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ✅ Valid: Consecutive interpolations with classes between
 * @validClasses [flex, p-4]
 */
export function ConsecutiveInterpolations() {
	return (
		<div className={`${dynamicClass} flex ${anotherClass} p-4`}>Consecutive interpolations</div>
	);
}
