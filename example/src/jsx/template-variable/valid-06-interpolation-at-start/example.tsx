// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Interpolation at start with trailing spaces
 * @validClasses [flex, items-center]
 */
export function InterpolationAtStart() {
	return <div className={`${dynamicClass} flex items-center`}>Interpolation at start</div>;
}
