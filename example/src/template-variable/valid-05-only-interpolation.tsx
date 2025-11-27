// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Empty static parts (only interpolation)
 */
export function OnlyInterpolation() {
	return <div className={`${dynamicClass}`}>Only interpolation</div>;
}
