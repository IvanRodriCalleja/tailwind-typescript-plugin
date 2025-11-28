import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Array with trailing comma
 * @validClasses [flex, items-center, justify-center]
 */
export function ArrayWithTrailingComma() {
	return <div className={cn(['flex', 'items-center', 'justify-center'])}>Trailing comma</div>;
}

