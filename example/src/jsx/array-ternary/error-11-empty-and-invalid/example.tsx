import { clsx as cn } from 'clsx';

/**
 * ❌ Invalid: Ternary with invalid in non-empty branch
 * @invalidClasses [invalid-class]
 * @validClasses [flex]
 */

const isActive = true;

export function ArrayTernaryWithEmptyAndInvalid() {
	return <div className={cn(['flex', isActive ? 'invalid-class' : ''])}>Invalid with empty</div>;
}
