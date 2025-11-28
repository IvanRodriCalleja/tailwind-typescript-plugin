import { clsx as cn } from 'clsx';

/**
 * ✅ Valid: Array with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function ArrayWithVariants() {
	return (
		<div className={cn(['hover:bg-blue-500', 'focus:ring-2', 'active:scale-95'])}>
			Array with variants
		</div>
	);
}

