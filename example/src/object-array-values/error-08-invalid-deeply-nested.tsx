import { clsx } from 'clsx';

/**
 * ❌ Invalid: Deeply nested arrays with invalid
 * @invalidClasses [invalid-deep]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectDeeplyNestedArrayValueInvalid() {
	return (
		<div className={clsx({ flex: [[['items-center', 'invalid-deep', 'justify-center']]] })}>
			Invalid deep
		</div>
	);
}
