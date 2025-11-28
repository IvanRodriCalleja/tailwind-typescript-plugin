import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Ternary with mix of arbitrary and invalid
 * @invalidClasses [invalid-size]
 * @validClasses [flex, h-[50vh], h-[30vh]]
 */
export function TernaryWithArbitraryAndInvalid() {
	return (
		<div className={clsx('flex', isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]')}>
			Ternary with arbitrary and invalid
		</div>
	);
}

// Mock function declarations
