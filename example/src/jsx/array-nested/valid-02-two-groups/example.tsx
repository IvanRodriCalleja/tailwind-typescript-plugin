import { cn } from '../utils';

/**
 * ✅ Valid: Two nested arrays at same level
 * @validClasses [flex, items-center, justify-center, bg-blue-500]
 */
export function NestedArrayTwoGroupsValid() {
	return (
		<div
			className={cn([
				['flex', 'items-center'],
				['justify-center', 'bg-blue-500']
			])}>
			Two groups
		</div>
	);
}
