// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Interpolation at end with leading spaces
 * @validClasses [flex, items-center]
 */
export function InterpolationAtEnd() {
	return <div className={`flex items-center ${dynamicClass}`}>Interpolation at end</div>;
}
