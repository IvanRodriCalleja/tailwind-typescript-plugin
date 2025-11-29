// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Template literal with interpolation, mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleInterpolationMixed() {
	return (
		<div className={`flex ${dynamicClass} invalid-class items-center`}>
			Mixed valid and invalid with interpolation
		</div>
	);
}
