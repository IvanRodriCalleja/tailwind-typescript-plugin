// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Variants with interpolation
 * @validClasses [hover:bg-blue-500, focus:ring-2, md:flex]
 */
export function VariantsWithInterpolation() {
	return (
		<div className={`hover:bg-blue-500 ${dynamicClass} focus:ring-2 md:flex`}>
			Variants with interpolation
		</div>
	);
}
