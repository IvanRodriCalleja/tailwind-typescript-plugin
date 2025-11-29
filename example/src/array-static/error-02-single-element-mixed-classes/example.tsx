import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Single element with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function SingleElementMixedClasses() {
	return <div className={cn(['flex invalid-class items-center'])}>Mixed classes</div>;
}
