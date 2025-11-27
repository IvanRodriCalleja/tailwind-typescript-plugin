// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ✅ Valid: Multiple interpolations with valid static classes
 * @validClasses [flex, items-center, justify-between]
 */
export function MultipleInterpolationsAllValid() {
	return (
		<div className={`flex ${dynamicClass} items-center ${anotherClass} justify-between`}>
			Multiple interpolations with valid classes
		</div>
	);
}
