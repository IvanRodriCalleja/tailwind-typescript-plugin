// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Binary with Tailwind variants
 * @validClasses [hover:bg-blue-500, md:text-lg]
 */
export function BinaryWithVariants() {
	return <div className={isActive && 'hover:bg-blue-500 md:text-lg'}>Binary with variants</div>;
}
