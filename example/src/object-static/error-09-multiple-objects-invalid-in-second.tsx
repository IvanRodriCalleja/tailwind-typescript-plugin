import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ❌ Invalid: Multiple objects with invalid in second object
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center]
 */
export function MultipleObjectsInvalidInSecond() {
	return (
		<div
			className={clsx(
				{ flex: true, 'items-center': true },
				{ 'justify-center': isActive, 'invalid-class': true }
			)}>
			Invalid in second
		</div>
	);
}

