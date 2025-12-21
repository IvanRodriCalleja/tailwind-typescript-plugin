import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Invalid in last element
 * @invalidClasses [invalid-last]
 * @validClasses [flex, items-center]
 */
export function InvalidInLastElement() {
	return <div className={cn(['flex', 'items-center', 'invalid-last'])}>Invalid last</div>;
}
