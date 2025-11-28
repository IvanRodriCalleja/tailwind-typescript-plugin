import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;
const hasError = false;

/**
 * ❌ Invalid: Multiple objects with invalid in first object
 * @invalidClasses [invalid-error]
 * @validClasses [items-center, justify-center, bg-blue-500]
 */
export function MultipleObjectsInvalidInFirst() {
	return (
		<div
			className={clsx(
				{ 'invalid-error': hasError, 'items-center': true },
				{ 'justify-center': isActive, 'bg-blue-500': true }
			)}>
			Invalid in first
		</div>
	);
}

