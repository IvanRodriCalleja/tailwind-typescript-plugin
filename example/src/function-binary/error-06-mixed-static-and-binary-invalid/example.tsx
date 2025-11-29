import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isError = false;

/**
 * ❌ Invalid: Mix with invalid in both static and binary
 * @invalidClasses [invalid-static, invalid-binary]
 * @validClasses [flex, items-center]
 */
export function MixedStaticAndBinaryInvalid() {
	return (
		<div className={clsx('flex', 'invalid-static', isError && 'invalid-binary', 'items-center')}>
			Mixed with invalid
		</div>
	);
}

// Mock function declarations
