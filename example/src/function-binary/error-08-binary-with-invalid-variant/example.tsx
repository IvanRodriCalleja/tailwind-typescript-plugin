import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Binary with invalid variant
 * @invalidClasses [invalid-variant:bg-blue]
 * @validClasses [flex]
 */
export function BinaryWithInvalidVariant() {
	return (
		<div className={clsx('flex', isActive && 'invalid-variant:bg-blue')}>
			Binary with invalid variant
		</div>
	);
}

// Mock function declarations
