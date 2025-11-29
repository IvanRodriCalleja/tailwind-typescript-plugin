import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Computed property name with string literal
 * @validClasses [flex, items-center]
 */
export function ObjectComputedPropertyValid() {
	return (
		<div className={clsx({ ['flex']: true, ['items-center']: isActive })}>Computed property</div>
	);
}
