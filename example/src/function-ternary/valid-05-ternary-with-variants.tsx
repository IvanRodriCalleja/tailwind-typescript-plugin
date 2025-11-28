import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Ternary with Tailwind variants
 * @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
 */
export function TernaryWithVariants() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
			)}>
			Ternary with variants
		</div>
	);
}

// Mock function declarations
