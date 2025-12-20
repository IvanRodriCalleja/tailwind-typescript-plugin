// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

/**
 * ✅ Valid: Extra spaces around interpolations
 * @validClasses [flex, items-center, justify-center]
 */
export function ExtraSpacesAroundInterpolation() {
	return (
		<div className={`flex  ${dynamicClass}  items-center   ${anotherClass}   justify-center`}>
			Extra spaces (should be handled correctly)
		</div>
	);
}
