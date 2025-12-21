/**
 * ❌ Invalid: Nested objects with arrays, invalid in nested array value
 * @invalidClasses [invalid-bg]
 * @validClasses [flex, items-center, justify-center, text-white]
 */
import { cn } from '../utils';

export function NestedObjectsWithArraysInArraysInvalid() {
	return (
		<div
			className={cn([
				'flex',
				{ 'items-center': ['justify-center', 'invalid-bg'] },
				[{ 'text-white': true }]
			])}>
			Invalid nested
		</div>
	);
}
