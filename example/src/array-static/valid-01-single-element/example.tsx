import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Single element array with valid class
 * @validClasses [flex]
 */
export function SingleElementValid() {
	return <div className={cn(['flex'])}>Single element array</div>;
}
