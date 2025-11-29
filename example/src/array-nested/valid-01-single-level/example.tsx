import { cn } from '../utils';

/**
 * ✅ Valid: Single level nested array, all valid
 * @validClasses [flex, items-center]
 */
export function NestedArraySingleLevelValid() {
	return <div className={cn([['flex', 'items-center']])}>Single level nested</div>;
}
