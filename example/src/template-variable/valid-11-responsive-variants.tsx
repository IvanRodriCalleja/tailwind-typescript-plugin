// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ✅ Valid: Responsive variants with interpolation
 * @validClasses [sm:flex, md:grid, lg:grid-cols-3, xl:grid-cols-4]
 */
export function ResponsiveVariantsWithInterpolation() {
	return (
		<div
			className={`sm:flex ${dynamicClass} md:grid lg:grid-cols-3 ${anotherClass} xl:grid-cols-4`}>
			Responsive variants with interpolation
		</div>
	);
}
