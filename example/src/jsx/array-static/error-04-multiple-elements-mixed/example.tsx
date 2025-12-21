import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Multiple elements with mix of valid and invalid
 * @invalidClasses [invalid-class]
 * @validClasses [flex, items-center]
 */
export function MultipleElementsMixed() {
	return <div className={cn(['flex', 'invalid-class', 'items-center'])}>Mixed elements</div>;
}
