import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Single element with multiple classes
 * @validClasses [flex, items-center, justify-center]
 */
export function SingleElementMultipleClasses() {
	return (
		<div className={cn(['flex items-center justify-center'])}>Multiple classes in one element</div>
	);
}

