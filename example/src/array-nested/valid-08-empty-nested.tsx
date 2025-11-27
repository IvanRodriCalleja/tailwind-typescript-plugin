import { cn } from '../utils';

/**
 * ✅ Valid: Empty nested arrays
 * @validClasses [flex]
 */
export function NestedArrayEmpty() {
	return <div className={cn([[], 'flex', [[]]])}>Empty nested arrays</div>;
}
