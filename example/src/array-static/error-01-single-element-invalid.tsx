import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Single element array with invalid class
 * @invalidClasses [invalid-class]
 */
export function SingleElementInvalid() {
	return <div className={cn(['invalid-class'])}>Single element invalid</div>;
}

