// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ❌ Invalid: Invalid variant with interpolation
 * @invalidClasses [invalidvariant:bg-blue-500]
 */
export function InvalidVariantWithInterpolation() {
	return (
		<div className={`${dynamicClass} invalidvariant:bg-blue-500`}>
			Invalid variant with interpolation
		</div>
	);
}
