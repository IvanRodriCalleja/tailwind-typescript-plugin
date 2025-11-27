// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with Tailwind variants
 * @validClasses [hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */
export function TernaryWithVariants() {
	return (
		<div className={isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'}>
			Ternary with variants
		</div>
	);
}
