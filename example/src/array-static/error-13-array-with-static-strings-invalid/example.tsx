import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Array with static strings, invalid in array
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, bg-blue-500]
 */
export function ArrayWithStaticStringsInvalid() {
	return (
		<div className={cn('flex', ['items-center', 'invalid-class'], 'bg-blue-500')}>
			Array with static invalid
		</div>
	);
}
