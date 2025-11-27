// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ✅ Valid: Multiple arguments with binary expressions, all valid
 * @validClasses [flex, text-red-500, bg-yellow-100]
 */
export function MultipleBinaryArgsAllValid() {
	return (
		<div className={clsx('flex', isError && 'text-red-500', hasWarning && 'bg-yellow-100')}>
			Multiple binary arguments
		</div>
	);
}

// Mock function declarations
declare function clsx(...args: unknown[]): string;
