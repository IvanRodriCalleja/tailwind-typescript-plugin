// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Arbitrary values with interpolation
 * @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
 */
export function ArbitraryValuesWithInterpolation() {
	return (
		<div className={`h-[50vh] ${dynamicClass} w-[100px] bg-[#ff0000]`}>
			Arbitrary values with interpolation
		</div>
	);
}
