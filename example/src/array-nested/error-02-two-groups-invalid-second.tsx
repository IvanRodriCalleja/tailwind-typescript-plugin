import { cn } from '../utils';

/**
 * ❌ Invalid: Two nested arrays, invalid in second
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center, justify-center]
 */
export function NestedArrayTwoGroupsInvalidSecond() {
	return (
		<div
			className={cn([
				['flex', 'items-center'],
				['justify-center', 'invalid-class']
			])}>
			Invalid in second
		</div>
	);
}
