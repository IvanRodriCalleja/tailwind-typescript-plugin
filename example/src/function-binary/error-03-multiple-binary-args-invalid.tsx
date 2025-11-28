import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;
const hasWarning = false;

/**
 * ❌ Invalid: Multiple binary arguments with invalid classes
 * @invalidClasses [invalid-error, invalid-warning]
 * @validClasses [flex]
 */
export function MultipleBinaryArgsInvalid() {
	return (
		<div className={clsx('flex', isError && 'invalid-error', hasWarning && 'invalid-warning')}>
			Multiple binary with invalid
		</div>
	);
}

// Mock function declarations
