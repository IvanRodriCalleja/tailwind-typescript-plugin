import clsx from 'clsx';

/**
 * ✅ Valid: Custom attribute with clsx function call
 * Tests that custom attributes work with utility functions
 * @validClasses [flex, items-center, bg-white]
 */
export function CustomWithClsx() {
	return (
		<div customStyles={clsx('flex', 'items-center', 'bg-white')}>Custom attribute with clsx</div>
	);
}
