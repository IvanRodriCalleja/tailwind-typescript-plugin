import { cn } from '../utils';

/**
 * ❌ Invalid: Single level nested array, invalid class
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */
export function NestedArraySingleLevelInvalid() {
	return <div className={cn([['flex', 'invalid-class']])}>Invalid nested</div>;
}
