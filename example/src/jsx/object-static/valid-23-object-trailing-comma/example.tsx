import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object with trailing comma
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectTrailingComma() {
	return (
		<div className={clsx({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Trailing comma
		</div>
	);
}
