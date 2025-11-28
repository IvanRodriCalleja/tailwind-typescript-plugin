import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;

/**
 * ✅ Valid: Ternary and binary combined in function
 * @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
 */
export function TernaryAndBinaryValid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'bg-blue-500' : 'bg-gray-500',
				hasError && 'text-red-500'
			)}>
			Ternary and binary in function
		</div>
	);
}

// Mock function declarations
