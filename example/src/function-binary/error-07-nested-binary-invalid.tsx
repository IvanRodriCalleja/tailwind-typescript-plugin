import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;
const isActive = true;

/**
 * ❌ Invalid: Nested binary with invalid class
 * @invalidClasses [invalid-nested]
 * @validClasses [flex]
 */
export function NestedBinaryInvalid() {
	return (
		<div className={clsx('flex', isError && isActive && 'invalid-nested')}>
			Nested binary invalid
		</div>
	);
}

// Mock function declarations
