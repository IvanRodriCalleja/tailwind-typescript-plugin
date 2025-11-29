import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Multiple objects with invalid in both
 * @invalidClasses [invalid-first, invalid-second]
 * @validClasses [flex, bg-blue-500]
 */
export function MultipleObjectsInvalidInBoth() {
	return (
		<div
			className={clsx(
				{ flex: true, 'invalid-first': true },
				{ 'invalid-second': isActive, 'bg-blue-500': true }
			)}>
			Invalid in both
		</div>
	);
}
