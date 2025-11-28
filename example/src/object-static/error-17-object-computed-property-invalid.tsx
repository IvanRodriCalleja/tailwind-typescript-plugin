import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Computed property name with invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function ObjectComputedPropertyInvalid() {
	return (
		<div className={clsx({ ['flex']: true, ['invalid-class']: isActive })}>Computed invalid</div>
	);
}

