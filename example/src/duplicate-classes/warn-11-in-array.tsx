import { clsx as cn } from 'clsx';

/**
 * ⚠️ Warning: Duplicate in array literal
 * @duplicateClasses [flex, flex]
 */
export function DuplicateInArray() {
	return <div className={cn(['flex', 'flex', 'items-center'])}>Duplicate in array</div>;
}

