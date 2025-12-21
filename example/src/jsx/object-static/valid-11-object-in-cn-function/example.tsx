import { clsx as cn } from 'clsx';

// Simulate dynamic values that might come from props or state
const isActive = true;

/**
 * ✅ Valid: Object in cn() function
 * @validClasses [flex, items-center, justify-center]
 */
export function ObjectInCnFunction() {
	return (
		<div className={cn({ flex: true, 'items-center': true, 'justify-center': isActive })}>
			Object in cn()
		</div>
	);
}
