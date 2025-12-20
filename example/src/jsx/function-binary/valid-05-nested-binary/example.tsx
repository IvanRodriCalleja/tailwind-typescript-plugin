import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;

/**
 * ✅ Valid: Nested binary expressions
 * @validClasses [flex, text-red-500, font-bold]
 */
export function NestedBinaryValid() {
	return (
		<div className={clsx('flex', isError && isActive && 'text-red-500 font-bold')}>
			Nested binary
		</div>
	);
}

// Mock function declarations
