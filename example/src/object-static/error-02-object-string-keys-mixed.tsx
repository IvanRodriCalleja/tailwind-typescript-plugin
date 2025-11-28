import clsx from 'clsx';

/**
 * ❌ Invalid: Object with mix of valid and invalid string keys
 * @invalidClasses [invalid-center]
 * @validClasses [flex, items-start]
 */
export function ObjectStringKeysMixed() {
	return (
		<div className={clsx({ flex: true, 'invalid-center': true, 'items-start': true })}>
			Mixed keys
		</div>
	);
}

