import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ❌ Invalid: Mix of valid and invalid binary arguments
 * @invalidClasses [invalid-warning]
 * @validClasses [flex, text-red-500]
 */
export function MultipleBinaryArgsMixed() {
	return (
		<div className={clsx('flex', isError && 'text-red-500', hasWarning && 'invalid-warning')}>
			Mixed binary arguments
		</div>
	);
}

// Mock function declarations
