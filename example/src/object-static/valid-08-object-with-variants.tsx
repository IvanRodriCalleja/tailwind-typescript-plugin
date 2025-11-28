import clsx from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object with variants
 * @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
 */
export function ObjectWithVariants() {
	return (
		<div
			className={clsx({
				'hover:bg-blue-500': true,
				'focus:ring-2': true,
				'active:scale-95': isActive
			})}>
			Variants
		</div>
	);
}

