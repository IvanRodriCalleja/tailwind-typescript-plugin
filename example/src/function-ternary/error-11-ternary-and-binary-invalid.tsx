import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;

/**
 * ❌ Invalid: Ternary and binary with invalid classes
 * @invalidClasses [invalid-active, invalid-error]
 * @validClasses [flex, bg-gray-500]
 */
export function TernaryAndBinaryInvalid() {
	return (
		<div
			className={clsx(
				'flex',
				isActive ? 'invalid-active' : 'bg-gray-500',
				hasError && 'invalid-error'
			)}>
			Ternary and binary with invalid
		</div>
	);
}

// Mock function declarations
