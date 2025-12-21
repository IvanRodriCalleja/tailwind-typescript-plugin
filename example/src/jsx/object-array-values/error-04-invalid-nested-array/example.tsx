import { clsx } from 'clsx';

/**
 * ❌ Invalid: Nested arrays as object values with invalid
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectNestedArrayValueInvalid() {
	return (
		<div className={clsx({ flex: [['items-center', 'invalid-nested']], 'justify-center': true })}>
			Invalid nested
		</div>
	);
}
