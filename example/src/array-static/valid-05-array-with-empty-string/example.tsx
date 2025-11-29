import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Array with empty string element
 * @validClasses [flex, items-center]
 */
export function ArrayWithEmptyString() {
	return <div className={cn(['flex', '', 'items-center'])}>Array with empty string</div>;
}
