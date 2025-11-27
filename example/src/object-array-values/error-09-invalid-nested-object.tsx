import { clsx } from 'clsx';

const isActive = true;

/**
 * ❌ Invalid: Object inside array value with invalid
 * @invalidClasses [invalid-nested-obj]
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectArrayValueWithNestedObjectInvalid() {
	return (
		<div
			className={clsx({
				flex: ['items-center', { 'justify-center': true, 'invalid-nested-obj': isActive }]
			})}>
			Invalid object in array
		</div>
	);
}
