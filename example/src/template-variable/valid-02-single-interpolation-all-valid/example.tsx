// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Template literal with interpolation, all static parts valid
 * @validClasses [flex, items-center]
 */
export function SingleInterpolationAllValid() {
	return (
		<div className={`flex ${dynamicClass} items-center`}>Valid classes with interpolation</div>
	);
}
