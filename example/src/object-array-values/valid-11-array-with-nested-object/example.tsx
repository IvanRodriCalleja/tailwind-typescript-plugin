import { clsx } from 'clsx';

const isActive = true;

/**
 * ✅ Valid: Object inside array value
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function ObjectArrayValueWithNestedObject() {
	return (
		<div
			className={clsx({
				flex: ['items-center', { 'justify-center': true, 'bg-blue-500': isActive }]
			})}>
			Object in array
		</div>
	);
}
