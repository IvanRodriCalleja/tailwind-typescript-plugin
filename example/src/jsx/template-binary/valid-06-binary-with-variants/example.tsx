// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Binary expression with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:text-lg]
 */
export function BinaryWithVariants() {
	return (
		<div className={`flex ${isActive && 'hover:bg-blue-500 md:text-lg'}`}>Binary with variants</div>
	);
}
