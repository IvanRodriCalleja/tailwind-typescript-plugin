import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Mix of static strings and ternary expressions
 * @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
 */
export function MixedStaticAndTernaryValid() {
	return (
		<div
			className={clsx(
				'flex',
				'items-center',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				'font-bold'
			)}>
			Mixed static and ternary
		</div>
	);
}

// Mock function declarations
