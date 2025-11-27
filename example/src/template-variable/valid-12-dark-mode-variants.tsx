// Simulate dynamic class names that might come from props or state
const dynamicClass = 'some-dynamic-class';

/**
 * ✅ Valid: Dark mode variants with interpolation
 * @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
 */
export function DarkModeVariantsWithInterpolation() {
	return (
		<div className={`bg-white dark:bg-gray-900 ${dynamicClass} text-black dark:text-white`}>
			Dark mode variants with interpolation
		</div>
	);
}
