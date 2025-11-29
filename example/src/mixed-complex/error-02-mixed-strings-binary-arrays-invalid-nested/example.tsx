/**
 * ❌ Invalid: Mix with invalid in nested array
 * @invalidClasses [invalid-nested]
 * @validClasses [flex, items-center, justify-center]
 */
import { cn } from '../utils';

const isActive = true;

export function MixedStringsBinaryArraysInvalidNested() {
	return (
		<div
			className={cn(
				'flex',
				isActive && 'items-center',
				[['justify-center', 'invalid-nested']],
				'text-white'
			)}>
			Invalid nested
		</div>
	);
}
